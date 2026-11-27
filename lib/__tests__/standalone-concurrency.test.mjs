import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

import readJSONFile from '../testUtils/readJSONFile.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import standalone from '../standalone.mjs';

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

const tmpDir = fixturesPath('tmp', 'standalone-concurrency');

const config = {
	rules: {
		'block-no-empty': true,
		'color-named': 'never',
	},
};

const cleanCss = 'a { color: #fff; }\n';
const markedCss = 'a { color: #000; } /* report-thread */\n';
const warningCss = 'a { color: red; }\nb {}\n';
const brokenCss = 'a { color: red;\n';

/** @param {import('stylelint').LinterOptions} [options] */
const lintTmpDir = (options) => standalone({ files: `${tmpDir}/*.css`, config, ...options });

const threadConfig = {
	plugins: [fixturesPath('plugin-report-thread.mjs')],
	rules: { 'plugin/report-thread': true },
};

/** @param {import('stylelint').LinterResult} linterResult */
const threadsByFile = ({ results }) =>
	Object.fromEntries(
		results
			.filter((result) => !result.ignored)
			.map((result) => [
				path.basename(String(result.source)),
				result.warnings.find((warning) => warning.rule === 'plugin/report-thread')?.text,
			]),
	);

// The glob order can vary between runs
/** @param {import('stylelint').LinterResult} linterResult */
const sortedReport = ({ report }) =>
	JSON.parse(report).sort((a, b) => String(a.source).localeCompare(String(b.source)));

/** @param {import('stylelint').LinterResult} linterResult */
const sortedResults = ({ results }) =>
	results
		.map(({ _postcssResult, ...result }) => result)
		.sort((a, b) => String(a.source).localeCompare(String(b.source)));

describe('standalone with concurrency', () => {
	beforeEach(async () => {
		mock.method(process, 'emitWarning', () => {});

		await mkdir(tmpDir, { recursive: true });
		await Promise.all([
			...Array.from({ length: 9 }, (_, i) =>
				writeFile(path.join(tmpDir, `warning-${i}.css`), warningCss),
			),
			writeFile(path.join(tmpDir, 'clean.css'), cleanCss),
			writeFile(path.join(tmpDir, 'broken.css'), brokenCss),
		]);
	});

	afterEach(async () => {
		mock.restoreAll();
		await rm(tmpDir, { recursive: true, force: true });
	});

	it('returns the same results as linting in the main thread', async (t) => {
		const main = await lintTmpDir();
		const workers = await lintTmpDir({ concurrency: 2 });

		t.assert.deepStrictEqual(sortedResults(workers), sortedResults(main));
		t.assert.strictEqual(workers.errored, main.errored);
		t.assert.deepStrictEqual(workers.ruleMetadata, main.ruleMetadata);
	});

	it('lints in worker threads', async (t) => {
		const files = ['marked-0.css', 'marked-1.css'].map((file) => path.join(tmpDir, file));

		await Promise.all(files.map((file) => writeFile(file, markedCss)));

		t.assert.deepStrictEqual(
			threadsByFile(await standalone({ files, config: threadConfig, concurrency: 2 })),
			{
				'marked-0.css': 'linted in the worker thread (plugin/report-thread)',
				'marked-1.css': 'linted in the worker thread (plugin/report-thread)',
			},
		);
	});

	it('returns a result per file', async (t) => {
		const { results } = await lintTmpDir({ concurrency: 3 });
		const sources = results.map((result) => result.source);

		t.assert.strictEqual(sources.length, 11);
		t.assert.strictEqual(new Set(sources).size, 11);
	});

	it('reports parse errors like the main thread', async (t) => {
		const files = ['parse-error-0.css', 'parse-error-1.css'].map((file) => path.join(tmpDir, file));

		await Promise.all(files.map((file) => writeFile(file, 'a[=] {}\n')));

		const options = {
			files,
			config: { rules: { 'selector-attribute-quotes': 'always' } },
			formatter: /** @type {const} */ ('json'),
		};
		const main = await standalone(options);
		const workers = await standalone({ ...options, concurrency: 2 });

		t.assert.strictEqual(workers.results[0].parseErrors.length, 1);
		t.assert.deepStrictEqual(sortedReport(workers), sortedReport(main));
	});

	it('reports CSS syntax errors like the main thread', async (t) => {
		const { results } = await lintTmpDir({ concurrency: 2 });
		const broken = results.find((result) => result.source?.endsWith('broken.css'));

		t.assert.strictEqual(broken?.errored, true);
		t.assert.strictEqual(broken?.warnings[0]?.rule, 'CssSyntaxError');
	});

	it('supports the verbose formatter', async (t) => {
		const fixable = path.join(tmpDir, 'fixable.css');

		await writeFile(fixable, 'a { color: #ffffff; }\n');

		const lintFixable = (options) =>
			standalone({
				files: fixable,
				config: { rules: { 'color-hex-length': 'short' } },
				fix: true,
				formatter: 'verbose',
				...options,
			});

		const main = await lintFixable();

		await writeFile(fixable, 'a { color: #ffffff; }\n');

		const workers = await standalone({
			files: [fixable, path.join(tmpDir, 'clean.css')],
			config: { rules: { 'color-hex-length': 'short' } },
			fix: true,
			formatter: 'verbose',
			concurrency: 2,
		});

		t.assert.match(main.report, /color-hex-length: 1/);
		t.assert.match(workers.report, /color-hex-length: 1/);
	});

	it('supports the maxWarnings option', async (t) => {
		const { maxWarningsExceeded } = await lintTmpDir({ concurrency: 2, maxWarnings: 3 });

		t.assert.deepStrictEqual(maxWarningsExceeded, { maxWarnings: 3, foundWarnings: 19 });
	});

	it('writes fixes to disk', async (t) => {
		const files = ['fix-0.css', 'fix-1.css'].map((file) => path.join(tmpDir, file));

		await Promise.all(files.map((file) => writeFile(file, 'a { color: #ffffff; }\n')));

		const { results } = await standalone({
			files,
			config: { rules: { 'color-hex-length': 'short' } },
			fix: true,
			concurrency: 2,
		});

		for (const file of files) {
			t.assert.strictEqual(await readFile(file, 'utf8'), 'a { color: #fff; }\n');
		}

		t.assert.deepStrictEqual(
			results.map((result) => result.autofixed),
			[true, true],
		);
	});

	it('emits an experimental warning', async (t) => {
		await lintTmpDir({ concurrency: 2 });

		t.assert.deepStrictEqual(process.emitWarning.mock.calls[0]?.arguments, [
			'The concurrency option is experimental.',
			{
				type: 'ExperimentalWarning',
				code: 'stylelint:102',
				detail: 'See https://stylelint.io/user-guide/options#concurrency for more information.',
			},
		]);
	});

	describe('deprecated rules', () => {
		const deprecatedOptions = {
			config: {
				plugins: [fixturesPath('plugin-deprecated.mjs')],
				rules: { 'plugin/deprecated': true },
			},
			files: `${tmpDir}/warning-*.css`,
		};

		const emittedDeprecationWarnings = () =>
			process.emitWarning.mock.calls
				.map((call) => call.arguments)
				.filter(([, { type }]) => type === 'DeprecationWarning');

		it('emits a deprecation warning once, from the main thread', async (t) => {
			const stderr = t.mock.method(process.stderr, 'write', () => true);

			const { results } = await standalone({ ...deprecatedOptions, concurrency: 2 });

			t.assert.ok(results.every(({ deprecations }) => deprecations.length === 2));
			t.assert.deepStrictEqual(emittedDeprecationWarnings(), [
				[
					'The "plugin/deprecated" rule is deprecated.',
					{
						type: 'DeprecationWarning',
						code: 'stylelint:006',
						detail:
							'Please be aware that the "plugin/deprecated" rule will soon be either removed or renamed.',
					},
				],
			]);
			t.assert.deepStrictEqual(
				stderr.mock.calls
					.map((call) => String(call.arguments[0]))
					.filter((output) => output.includes('DeprecationWarning')),
				[],
			);
		});

		it('emits no deprecation warning with the quietDeprecationWarnings option', async (t) => {
			const { results } = await standalone({
				...deprecatedOptions,
				concurrency: 2,
				quietDeprecationWarnings: true,
			});

			t.assert.ok(results.every(({ deprecations }) => deprecations.length === 1));
			t.assert.deepStrictEqual(emittedDeprecationWarnings(), []);
		});
	});

	for (const concurrency of /** @type {const} */ (['auto', 1])) {
		it(`lints in the main thread with a concurrency of ${concurrency} and a few files`, async (t) => {
			const files = ['marked-0.css', 'marked-1.css'].map((file) => path.join(tmpDir, file));

			await Promise.all(files.map((file) => writeFile(file, markedCss)));

			t.assert.deepStrictEqual(
				threadsByFile(await standalone({ files, config: threadConfig, concurrency })),
				{
					'marked-0.css': 'linted in the main thread (plugin/report-thread)',
					'marked-1.css': 'linted in the main thread (plugin/report-thread)',
				},
			);
		});
	}

	it('rejects with the same error as the main thread', async (t) => {
		const options = { customSyntax: 'this-module-does-not-exist' };

		const mainError = await lintTmpDir(options).catch((error) => error);
		const workersError = await lintTmpDir({ ...options, concurrency: 2 }).catch((error) => error);

		t.assert.ok(mainError instanceof Error);
		t.assert.strictEqual(workersError.name, mainError.name);
		t.assert.strictEqual(workersError.message, mainError.message);
		t.assert.strictEqual(workersError.code, mainError.code);
	});

	it('rejects options that cannot be cloned', async (t) => {
		await t.assert.rejects(
			lintTmpDir({
				concurrency: 'auto',
				config: { ...config, plugins: [{ ruleName: 'plugin/foo', rule: () => () => {} }] },
			}),
			{
				name: 'TypeError',
				message:
					'The option "config" cannot be cloned. When concurrency is enabled, all options must be cloneable values (JSON values). For example, use "configFile" instead of a "config" object containing functions.',
			},
		);
	});

	it('reads the option from the configuration object', async (t) => {
		const main = await lintTmpDir();
		const fromConfig = await lintTmpDir({ config: { ...config, concurrency: 2 } });

		t.assert.deepStrictEqual(sortedResults(fromConfig), sortedResults(main));
		t.assert.strictEqual(process.emitWarning.mock.callCount(), 1);
	});

	it('prefers the option over the configuration object', async (t) => {
		const { results } = await lintTmpDir({
			concurrency: 2,
			config: { ...config, concurrency: 0 },
		});

		t.assert.strictEqual(results.length, 11);
	});

	for (const value of [0, -1, 1.5, Number.NaN, 'many']) {
		it(`rejects an invalid value: ${value}`, async (t) => {
			await t.assert.rejects(lintTmpDir({ concurrency: value }), {
				message: `Invalid option value "${value}" for "concurrency". Expected "auto" or a positive integer.`,
			});
		});
	}

	it('rejects an invalid value in the configuration object', async (t) => {
		await t.assert.rejects(lintTmpDir({ config: { ...config, concurrency: 0 } }), {
			message: 'Invalid option value "0" for "concurrency". Expected "auto" or a positive integer.',
		});
	});

	it('is ignored when linting code', async (t) => {
		const { results } = await standalone({ code: 'a { color: red; }', config, concurrency: 4 });

		t.assert.strictEqual(results[0].warnings.length, 1);
		t.assert.strictEqual(process.emitWarning.mock.callCount(), 0);
	});
});

describe('standalone with concurrency and cache', () => {
	const cacheLocation = path.join(tmpDir, '.stylelintcache');

	/** @param {import('stylelint').LinterOptions} [options] */
	const lintWithCache = (options) =>
		lintTmpDir({ cache: true, cacheLocation, concurrency: 2, ...options });

	beforeEach(async () => {
		mock.method(process, 'emitWarning', () => {});

		await mkdir(tmpDir, { recursive: true });
		await Promise.all(
			Array.from({ length: 10 }, (_, i) =>
				writeFile(path.join(tmpDir, `clean-${i}.css`), cleanCss),
			),
		);
	});

	afterEach(async () => {
		mock.restoreAll();
		await rm(tmpDir, { recursive: true, force: true });
	});

	it('serves unchanged files from the cache', async (t) => {
		const cold = await lintWithCache();

		t.assert.ok(cold.results.every((result) => !result.ignored));

		const warm = await lintWithCache();

		t.assert.strictEqual(warm.results.length, 10);
		t.assert.ok(warm.results.every((result) => result.ignored));
	});

	it('lints only the changed files', async (t) => {
		await lintWithCache();

		const changedFile = path.join(tmpDir, 'clean-0.css');

		await writeFile(changedFile, 'b { color: #000; }\n');

		const { results } = await lintWithCache();

		t.assert.deepStrictEqual(
			results.filter((result) => !result.ignored).map((result) => result.source),
			[changedFile],
		);
	});

	it('lints the changed files in workers', async (t) => {
		await lintWithCache({ config: threadConfig });

		await Promise.all(
			[0, 1, 2].map((i) => writeFile(path.join(tmpDir, `clean-${i}.css`), markedCss)),
		);

		t.assert.deepStrictEqual(threadsByFile(await lintWithCache({ config: threadConfig })), {
			'clean-0.css': 'linted in the worker thread (plugin/report-thread)',
			'clean-1.css': 'linted in the worker thread (plugin/report-thread)',
			'clean-2.css': 'linted in the worker thread (plugin/report-thread)',
		});
	});

	it('lints a lone changed file in the main thread', async (t) => {
		await lintWithCache({ config: threadConfig });
		await writeFile(path.join(tmpDir, 'clean-0.css'), markedCss);

		t.assert.deepStrictEqual(threadsByFile(await lintWithCache({ config: threadConfig })), {
			'clean-0.css': 'linted in the main thread (plugin/report-thread)',
		});
	});

	it("doesn't cache files with problems or CSS syntax errors", async (t) => {
		await writeFile(path.join(tmpDir, 'warning.css'), warningCss);
		await writeFile(path.join(tmpDir, 'broken.css'), brokenCss);

		await lintWithCache();

		const warm = await lintWithCache();

		t.assert.deepStrictEqual(
			warm.results
				.filter((result) => !result.ignored)
				.map((result) => path.basename(String(result.source)))
				.sort(),
			['broken.css', 'warning.css'],
		);
		t.assert.strictEqual(warm.errored, true);
	});

	it('writes the same cache as the main thread', async (t) => {
		const mainCacheLocation = path.join(tmpDir, '.stylelintcache-main');
		const ignoringConfig = { ...config, ignoreFiles: ['**/clean-9.css'] };

		await writeFile(path.join(tmpDir, 'warning.css'), warningCss);

		const main = await lintWithCache({
			concurrency: undefined,
			cacheLocation: mainCacheLocation,
			config: ignoringConfig,
		});
		const workers = await lintWithCache({ config: ignoringConfig });

		t.assert.deepStrictEqual(sortedResults(workers), sortedResults(main));
		t.assert.deepStrictEqual(
			Object.keys(readJSONFile(cacheLocation)).sort(),
			Object.keys(readJSONFile(mainCacheLocation)).sort(),
		);

		const mainWarm = await lintWithCache({
			concurrency: undefined,
			cacheLocation: mainCacheLocation,
			config: ignoringConfig,
		});
		const workersWarm = await lintWithCache({ config: ignoringConfig });

		t.assert.deepStrictEqual(sortedResults(workersWarm), sortedResults(mainWarm));
	});
});
