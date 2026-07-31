import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import standalone from '../standalone.mjs';

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

const cssTmpDir = fixturesPath('tmp', 'concurrency');

const config = {
	rules: {
		'block-no-empty': true,
		'color-named': 'never',
	},
};

const cleanCss = 'a { color: #fff; }\n';
const warningCss = 'a { color: red; }\nb {}\n';
const brokenCss = 'a { color: red;\n';

/** @param {import('stylelint').LinterOptions} [options] */
const lintTmpDir = (options) =>
	standalone({
		files: `${cssTmpDir}/*.css`,
		config,
		...options,
	});

beforeEach(async () => {
	await fs.mkdir(cssTmpDir, { recursive: true });

	const writes = [];

	for (let i = 0; i < 9; i++) {
		writes.push(fs.writeFile(path.join(cssTmpDir, `warning-${i}.css`), warningCss));
	}

	writes.push(fs.writeFile(path.join(cssTmpDir, 'clean.css'), cleanCss));
	writes.push(fs.writeFile(path.join(cssTmpDir, 'broken.css'), brokenCss));

	await Promise.all(writes);
});

afterEach(async () => {
	await fs.rm(cssTmpDir, { recursive: true });
});

describe('standalone with concurrency', () => {
	it('produces the same public output as linting in the main thread', async () => {
		const serial = await lintTmpDir({ formatter: 'json' });
		const parallel = await lintTmpDir({ formatter: 'json', concurrency: 2 });

		expect(parallel.report).toBe(serial.report);
		expect(parallel.errored).toBe(serial.errored);
		expect(parallel.ruleMetadata).toEqual(serial.ruleMetadata);
		expect(parallel.results.map((result) => result.source)).toEqual(
			serial.results.map((result) => result.source),
		);
	});

	it('produces the same report with the string formatter', async () => {
		const serial = await lintTmpDir({ formatter: 'string' });
		const parallel = await lintTmpDir({ formatter: 'string', concurrency: 3 });

		expect(parallel.report).toBe(serial.report);
	});

	it('reports CSS syntax errors like the main thread does', async () => {
		const { results } = await lintTmpDir({ concurrency: 2 });
		const brokenResult = results.find((result) => result.source?.endsWith('broken.css'));

		expect(brokenResult).toMatchObject({
			errored: true,
			warnings: [expect.objectContaining({ rule: 'CssSyntaxError' })],
		});
	});

	it('supports the maxWarnings option', async () => {
		const { maxWarningsExceeded } = await lintTmpDir({ concurrency: 2, maxWarnings: 3 });

		expect(maxWarningsExceeded).toMatchObject({ maxWarnings: 3, foundWarnings: 19 });
	});

	it('writes fixes to disk', async () => {
		const fixConfig = { rules: { 'color-hex-length': 'short' } };

		await fs.writeFile(path.join(cssTmpDir, 'fix-target.css'), 'a { color: #ffffff; }\n');

		const { results } = await standalone({
			files: `${cssTmpDir}/fix-*.css`,
			config: fixConfig,
			fix: true,
			concurrency: 2,
		});

		const fixedCss = await fs.readFile(path.join(cssTmpDir, 'fix-target.css'), 'utf8');

		expect(fixedCss).toBe('a { color: #fff; }\n');
		expect(results[0].autofixed).toBe(true);
	});

	it('accepts "auto"', async () => {
		const { results, errored } = await lintTmpDir({ concurrency: 'auto' });

		expect(results).toHaveLength(11);
		expect(errored).toBe(true);
	});

	it('lints in the main thread with a concurrency of one', async () => {
		const serial = await lintTmpDir({ formatter: 'json' });
		const single = await lintTmpDir({ formatter: 'json', concurrency: 1 });

		expect(single.report).toBe(serial.report);
	});

	it('propagates worker errors like the main thread does', async () => {
		const options = { customSyntax: 'this-module-does-not-exist' };

		const serialError = await lintTmpDir(options).catch((error) => error);
		const parallelError = await lintTmpDir({ ...options, concurrency: 2 }).catch((error) => error);

		expect(serialError.message).toBeTruthy();
		expect(parallelError.message).toBe(serialError.message);
		expect(parallelError.name).toBe(serialError.name);
	});

	it('rejects options that cannot be passed to worker threads', async () => {
		await expect(
			lintTmpDir({
				concurrency: 2,
				config: { ...config, plugins: [{ ruleName: 'plugin/foo', rule: () => () => {} }] },
			}),
		).rejects.toThrow(/requires options that can be passed to worker threads/);
	});

	it('rejects the cache option', async () => {
		await expect(lintTmpDir({ concurrency: 2, cache: true })).rejects.toThrow(
			/The "cache" option is not supported when the "concurrency" option is enabled/,
		);
	});

	it.each([0, -1, 1.5, Number.NaN, 'many'])('rejects an invalid value: %s', async (value) => {
		await expect(lintTmpDir({ concurrency: value })).rejects.toThrow(
			/expected "auto" or a positive integer/,
		);
	});

	it('is ignored when linting a code string', async () => {
		const { results } = await standalone({
			code: 'a { color: red; }',
			config,
			concurrency: 4,
		});

		expect(results[0].warnings).toHaveLength(1);
	});
});
