import { after, before, describe, it } from 'node:test';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { availableParallelism } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

import lintFilesInWorkers, {
	calculateWorkerCount,
	validateConcurrency,
	validateOptionCloneability,
} from '../lintFilesInWorkers.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

const tmpDir = fixturesPath('tmp', 'lint-files-in-workers');
const files = Array.from({ length: 4 }, (_, i) => path.join(tmpDir, `file-${i}.css`));
const config = { rules: { 'block-no-empty': true } };

describe('validateConcurrency', () => {
	for (const value of [undefined, 'auto', 1, 8]) {
		it(`accepts ${value}`, (t) => {
			t.assert.doesNotThrow(() => validateConcurrency(value));
		});
	}

	for (const value of [0, -1, 2.5, Number.NaN, 'four', true, null]) {
		it(`rejects ${value}`, (t) => {
			t.assert.throws(() => validateConcurrency(value), {
				message: `Invalid option value "${value}" for "concurrency". Expected "auto" or a positive integer.`,
			});
		});
	}
});

describe('calculateWorkerCount', () => {
	const maxWorkers = availableParallelism() >> 1;

	it('lints in the main thread without the option', (t) => {
		t.assert.strictEqual(calculateWorkerCount(undefined, 1000), 0);
	});

	it('caps a number at the file count', (t) => {
		t.assert.strictEqual(calculateWorkerCount(8, 3), 3);
	});

	it('lints in the main thread instead of in a lone worker', (t) => {
		t.assert.strictEqual(calculateWorkerCount(1, 1000), 0);
		t.assert.strictEqual(calculateWorkerCount(8, 1), 0);
		t.assert.strictEqual(calculateWorkerCount(8, 0), 0);
	});

	it('uses a worker per 50 files with "auto"', (t) => {
		t.assert.strictEqual(calculateWorkerCount('auto', 50), 0);
		t.assert.strictEqual(calculateWorkerCount('auto', 51), maxWorkers >= 2 ? 2 : 0);
	});

	it('uses at most half the available cores with "auto"', (t) => {
		t.assert.strictEqual(calculateWorkerCount('auto', 1_000_000), maxWorkers > 1 ? maxWorkers : 0);
	});
});

describe('validateOptionCloneability', () => {
	it('accepts cloneable options', (t) => {
		t.assert.doesNotThrow(() => validateOptionCloneability({ config, fix: true }));
	});

	it('names the options that cannot be cloned', (t) => {
		t.assert.throws(
			() =>
				validateOptionCloneability({
					fix: true,
					customSyntax: { parse() {}, stringify() {} },
					config: { plugins: [() => {}] },
				}),
			{
				name: 'TypeError',
				message: /^The options "config" and "customSyntax" cannot be cloned\./,
			},
		);
	});
});

describe('lintWorker', () => {
	it('must be run in a worker thread', async (t) => {
		await t.assert.rejects(import('../lintWorker.mjs'), {
			message: 'This module must be run in a worker thread',
		});
	});
});

describe('lintFilesInWorkers', () => {
	before(async () => {
		await mkdir(tmpDir, { recursive: true });
		await Promise.all(
			files.map((file, i) => writeFile(file, i % 2 ? 'a {}\n' : 'a { top: 0; }\n')),
		);
	});

	after(async () => {
		await rm(tmpDir, { recursive: true, force: true });
	});

	it('returns the results in the order of the files', async (t) => {
		const results = await lintFilesInWorkers(files, 2, { config });

		t.assert.deepStrictEqual(
			results.map((result) => [result.source, result.warnings.length]),
			files.map((file, i) => [file, i % 2]),
		);
	});

	it('leaves no worker alive, even when a plugin holds a timer', async (t) => {
		const workers = [];
		const addWorker = (worker) => workers.push(worker);

		process.on('worker', addWorker);
		t.after(async () => {
			process.off('worker', addWorker);
			await Promise.all(workers.map((worker) => worker.terminate()));
		});

		const results = await lintFilesInWorkers(files, 2, {
			config: {
				plugins: [fixturesPath('plugin-holding-timer.mjs')],
				rules: { 'plugin/holding-timer': true },
			},
		});

		t.assert.strictEqual(results.length, files.length);
		t.assert.deepStrictEqual(
			workers.map(({ threadId }) => threadId),
			[-1, -1], // the ID of an exited thread
		);
	});

	it('rejects with the error of a worker', async (t) => {
		await t.assert.rejects(
			lintFilesInWorkers(files, 2, { config, customSyntax: 'this-module-does-not-exist' }),
			/this-module-does-not-exist/,
		);
	});

	it('rejects when a worker exits early', async (t) => {
		await t.assert.rejects(
			lintFilesInWorkers(files, 2, {
				config,
				customSyntax: fixturesPath('syntax-exiting-worker.mjs'),
			}),
			{ message: 'A worker thread exited unexpectedly with code 3' },
		);
	});

	it('rejects when the signal is already aborted', async (t) => {
		const reason = new Error('aborted before linting');

		await t.assert.rejects(
			lintFilesInWorkers(files, 2, { config }, AbortSignal.abort(reason)),
			reason,
		);
	});

	it('rejects when the signal aborts while linting', async (t) => {
		const controller = new AbortController();
		const linting = lintFilesInWorkers(files, 2, { config }, controller.signal);

		controller.abort(new Error('aborted while linting'));

		await t.assert.rejects(linting, { message: 'aborted while linting' });
	});
});
