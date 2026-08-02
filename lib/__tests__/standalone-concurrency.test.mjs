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

	it('reads the option from the configuration object', async () => {
		const serial = await lintTmpDir({ formatter: 'json' });
		const fromConfig = await lintTmpDir({
			formatter: 'json',
			config: { ...config, concurrency: 2 },
		});

		expect(fromConfig.report).toBe(serial.report);
	});

	it('prefers the option over the configuration object', async () => {
		const { results } = await lintTmpDir({
			concurrency: 2,
			config: { ...config, concurrency: 0 },
		});

		expect(results).toHaveLength(11);
	});

	it('rejects an invalid value in the configuration object', async () => {
		await expect(lintTmpDir({ config: { ...config, concurrency: 0 } })).rejects.toThrow(
			/expected "auto" or a positive integer/,
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

describe('standalone with concurrency and cache', () => {
	const cacheTmpDir = fixturesPath('tmp', 'concurrency-cache');
	const cacheLocation = path.join(cacheTmpDir, '.stylelintcache');

	const lintCacheTmpDir = (options) =>
		standalone({
			files: `${cacheTmpDir}/*.css`,
			config,
			cache: true,
			cacheLocation,
			concurrency: 2,
			...options,
		});

	beforeEach(async () => {
		await fs.mkdir(cacheTmpDir, { recursive: true });

		await Promise.all(
			Array.from({ length: 10 }, (_unused, i) =>
				fs.writeFile(path.join(cacheTmpDir, `clean-${i}.css`), cleanCss),
			),
		);
	});

	afterEach(async () => {
		await fs.rm(cacheTmpDir, { recursive: true });
	});

	it('caches linted files and serves them from the cache on the next run', async () => {
		const cold = await lintCacheTmpDir();

		expect(cold.results).toHaveLength(10);
		expect(cold.results.every((result) => !result.ignored)).toBe(true);

		const warm = await lintCacheTmpDir();

		expect(warm.results).toHaveLength(10);
		expect(warm.results.every((result) => result.ignored)).toBe(true);
		expect(warm.errored).toBe(false);
	});

	it('lints only the files that changed on a warm run', async () => {
		await lintCacheTmpDir();

		await fs.writeFile(path.join(cacheTmpDir, 'clean-0.css'), 'b { color: #000; }\n');

		const { results } = await lintCacheTmpDir();
		const changed = results.filter((result) => !result.ignored);

		expect(changed.map((result) => result.source)).toEqual([path.join(cacheTmpDir, 'clean-0.css')]);
	});

	it('does not cache files with lint errors or syntax errors', async () => {
		await fs.writeFile(path.join(cacheTmpDir, 'invalid.css'), warningCss);
		await fs.writeFile(path.join(cacheTmpDir, 'broken.css'), brokenCss);

		await lintCacheTmpDir();

		const warm = await lintCacheTmpDir();
		const relinted = warm.results.filter((result) => !result.ignored);

		expect(relinted.map((result) => path.basename(result.source ?? '')).sort()).toEqual([
			'broken.css',
			'invalid.css',
		]);
		expect(warm.errored).toBe(true);
	});

	it('returns the same results as a main-thread run with the cache', async () => {
		await fs.writeFile(path.join(cacheTmpDir, 'invalid.css'), warningCss);

		const serialCacheLocation = path.join(cacheTmpDir, '.stylelintcache-serial');

		await lintCacheTmpDir({ concurrency: undefined, cacheLocation: serialCacheLocation });
		const serialWarm = await lintCacheTmpDir({
			concurrency: undefined,
			cacheLocation: serialCacheLocation,
			formatter: 'json',
		});

		await lintCacheTmpDir();
		const parallelWarm = await lintCacheTmpDir({ formatter: 'json' });

		expect(parallelWarm.report).toBe(serialWarm.report);
	});
});
