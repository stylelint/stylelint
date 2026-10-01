import * as fs from 'node:fs/promises';
import { availableParallelism } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import lintFilesInWorkers, {
	resolveWorkerCount,
	validateConcurrency,
} from '../lintFilesInWorkers.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

const cssTmpDir = fixturesPath('tmp', 'lint-files-in-workers');

const config = { rules: { 'block-no-empty': true } };

const cssFiles = Array.from({ length: 4 }, (_unused, i) => path.join(cssTmpDir, `file-${i}.css`));

beforeAll(async () => {
	await fs.mkdir(cssTmpDir, { recursive: true });
	await Promise.all(cssFiles.map((file) => fs.writeFile(file, 'a { color: #fff; }\n')));
});

afterAll(async () => {
	await fs.rm(cssTmpDir, { recursive: true });
});

describe('validateConcurrency', () => {
	it.each([undefined, 'auto', 1, 8])('accepts %s', (value) => {
		expect(() => validateConcurrency(value)).not.toThrow();
	});

	it.each([0, -1, 2.5, Number.NaN, 'four', true])('rejects %s', (value) => {
		expect(() => validateConcurrency(value)).toThrow(/expected "auto" or a positive integer/);
	});
});

describe('resolveWorkerCount', () => {
	it('resolves to the main thread without the option', () => {
		expect(resolveWorkerCount(undefined, 1000)).toBe(1);
	});

	it('caps a worker count at the file count', () => {
		expect(resolveWorkerCount(8, 2)).toBe(2);
		expect(resolveWorkerCount(8, 0)).toBe(1);
	});

	it('resolves "auto" to the main thread for small runs', () => {
		expect(resolveWorkerCount('auto', 128)).toBe(1);
	});

	it('resolves "auto" to at most half the available cores', () => {
		const workerCount = resolveWorkerCount('auto', 1_000_000);

		expect(workerCount).toBeGreaterThanOrEqual(1);
		expect(workerCount).toBeLessThanOrEqual(Math.max(1, Math.floor(availableParallelism() / 2)));
	});
});

describe('lintFilesInWorkers', () => {
	it('rejects with the worker error when a task fails in a worker', async () => {
		await expect(
			lintFilesInWorkers(cssFiles, { config, customSyntax: 'this-module-does-not-exist' }, 2),
		).rejects.toThrow(/this-module-does-not-exist/);
	});

	it('rejects when a worker fails to start', async () => {
		await expect(
			lintFilesInWorkers(cssFiles, { config, cacheStrategy: 'bogus' }, 2),
		).rejects.toThrow(/cache strategy/);
	});

	it('rejects when the signal is already aborted', async () => {
		const reason = new Error('aborted before linting');

		await expect(
			lintFilesInWorkers(cssFiles, { config }, 2, AbortSignal.abort(reason)),
		).rejects.toThrow(reason);
	});

	it('rejects when the signal aborts during linting', async () => {
		const controller = new AbortController();
		const lintPromise = lintFilesInWorkers(cssFiles, { config }, 2, controller.signal);

		controller.abort(new Error('aborted during linting'));

		await expect(lintPromise).rejects.toThrow('aborted during linting');
	});
});
