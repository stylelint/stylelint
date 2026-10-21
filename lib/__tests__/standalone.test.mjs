import { beforeEach, describe, it, test } from 'node:test';
import path from 'node:path';

import { NoFilesFoundError } from '../utils/errors.mjs';
import readJSONFile from '../testUtils/readJSONFile.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import safeChdir from '../testUtils/safeChdir.mjs';
import standalone from '../standalone.mjs';

const dirname = import.meta.dirname;

const configBlockNoEmpty = readJSONFile(
	new URL('./fixtures/config-block-no-empty.json', import.meta.url),
);

const fixturesPath = replaceBackslashes(new URL('./fixtures', import.meta.url));

describe('standalone with one input file', () => {
	let report;
	let results;

	beforeEach(async () => {
		const data = await standalone({
			files: `${fixturesPath}/empty-block.css`,
			// Path to config file
			configFile: path.join(dirname, 'fixtures/config-block-no-empty.json'),
		});

		report = data.report;
		results = data.results;
	});

	it('triggers warning', (t) => {
		t.assert.ok(report.includes('block-no-empty'));
		t.assert.strictEqual(results.length, 1);
		t.assert.strictEqual(results[0].warnings.length, 1);
		t.assert.strictEqual(results[0].warnings[0].rule, 'block-no-empty');
	});
});

it('standalone with two file-specific globs', async (t) => {
	const { report, results } = await standalone({
		files: [`${fixturesPath}/e*y-block.*`, `${fixturesPath}/invalid-h*.css`],
		config: {
			rules: { 'block-no-empty': true, 'color-no-invalid-hex': true },
		},
	});

	t.assert.ok(report.includes('block-no-empty'));
	t.assert.ok(report.includes('color-no-invalid-hex'));
	t.assert.strictEqual(results.length, 2);
	t.assert.strictEqual(results[0].warnings.length, 1);
	t.assert.strictEqual(results[1].warnings.length, 1);

	/**
	 * Expecting warnings for these two rules, and order of warnings is not important,
	 * because files could be linted in any order
	 * [
	 * 	{ warnings: [{ rule: 'block-no-empty' }] },
	 * 	{ warnings: [{ rule: 'color-no-invalid-hex' }] },
	 * ]
	 */
	t.assert.deepStrictEqual(results.map(({ warnings }) => warnings[0].rule).sort(), [
		'block-no-empty',
		'color-no-invalid-hex',
	]);
});

describe('standalone with files and cwd', () => {
	let report;
	let results;

	beforeEach(async () => {
		const data = await standalone({
			files: 'empty-block.css',
			cwd: fixturesPath,
			// Path to config file
			configFile: path.join(dirname, 'fixtures/config-block-no-empty.json'),
		});

		report = data.report;
		results = data.results;
	});

	it('triggers warning', (t) => {
		t.assert.ok(report.includes('block-no-empty'));
		t.assert.strictEqual(results.length, 1);
		t.assert.strictEqual(results[0].warnings.length, 1);
		t.assert.strictEqual(results[0].warnings[0].rule, 'block-no-empty');
	});
});

test('absence of option validation', async (t) => {
	const {
		results: [result],
	} = await standalone({
		files: 'empty-block.css',
		cwd: fixturesPath,
		config: {
			rules: {
				'block-no-empty': '',
			},
		},
		validate: false,
	});

	t.assert.strictEqual(result.errored, true);
	t.assert.strictEqual(result.invalidOptionWarnings.length, 0);
});

it('standalone with input css', async (t) => {
	const { report, results } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
	});

	t.assert.ok(report.includes('block-no-empty'));
	t.assert.strictEqual(results.length, 1);
	t.assert.strictEqual(results[0].warnings.length, 1);
	t.assert.strictEqual(results[0].warnings[0].rule, 'block-no-empty');
});

it('standalone without input css and file(s) should throw error', async (t) => {
	await t.assert.rejects(() => standalone({ config: configBlockNoEmpty }), {
		message: 'You must pass stylelint a `files` glob or a `code` string, though not both',
	});
});

describe('standalone with nonexistent-file', () => {
	it('throws an error', async (t) => {
		const files = `${fixturesPath}/nonexistent-file.css`;
		const expectedError = new NoFilesFoundError(files);

		await t.assert.rejects(
			standalone({
				files,
				config: configBlockNoEmpty,
			}),
			expectedError,
		);
	});

	it('allowEmptyInput enabled quietly exits', async (t) => {
		const { results, errored, report } = await standalone({
			files: `${fixturesPath}/nonexistent-file.css`,
			config: configBlockNoEmpty,
			allowEmptyInput: true,
		});

		t.assert.strictEqual(results.length, 0);
		t.assert.strictEqual(errored, false);
		t.assert.strictEqual(report, '[]');
	});

	it('allowEmptyInput enabled (in config) quietly exits', async (t) => {
		const { results, errored, report } = await standalone({
			files: `${fixturesPath}/nonexistent-file.css`,
			config: { ...configBlockNoEmpty, allowEmptyInput: true },
		});

		t.assert.strictEqual(results.length, 0);
		t.assert.strictEqual(errored, false);
		t.assert.strictEqual(report, '[]');
	});

	it('allowEmptyInput enabled (in config file) quietly exits', async (t) => {
		const { results, errored, report } = await standalone({
			files: `${fixturesPath}/nonexistent-file.css`,
			configFile: `${fixturesPath}/config-allow-empty-input.json`,
		});

		t.assert.strictEqual(results.length, 0);
		t.assert.strictEqual(errored, false);
		t.assert.strictEqual(report, '[]');
	});

	it('allowEmptyInput disabled in options, regardless that it is enabled in config', async (t) => {
		await t.assert.rejects(
			standalone({
				files: `${fixturesPath}/nonexistent-file.css`,
				config: { ...configBlockNoEmpty, allowEmptyInput: true },
				allowEmptyInput: false,
			}),
			NoFilesFoundError,
		);
	});

	it('allowEmptyInput disabled in options, regardless that it is enabled in config file', async (t) => {
		await t.assert.rejects(
			standalone({
				files: `${fixturesPath}/nonexistent-file.css`,
				configFile: `${fixturesPath}/config-allow-empty-input.json`,
				allowEmptyInput: false,
			}),
			NoFilesFoundError,
		);
	});
});

describe('standalone passing code with syntax error', () => {
	let results;

	beforeEach(async () => {
		const data = await standalone({
			code: "a { color: 'red; }",
			config: { rules: { 'block-no-empty': true } },
		});

		results = data.results;
	});

	it('<input css 1> as source', (t) => {
		t.assert.strictEqual(results[0].source, '<input css 1>');
	});

	it('empty deprecations', (t) => {
		t.assert.strictEqual(results[0].deprecations.length, 0);
	});

	it('empty invalidOptionWarnings', (t) => {
		t.assert.strictEqual(results[0].invalidOptionWarnings.length, 0);
	});

	it('empty parseError', (t) => {
		t.assert.strictEqual(results[0].parseErrors.length, 0);
	});

	it('error registered', (t) => {
		t.assert.ok(results[0].errored);
	});

	it('syntax error rule is CssSyntaxError', (t) => {
		t.assert.strictEqual(results[0].warnings.length, 1);
		t.assert.strictEqual(results[0].warnings[0].rule, 'CssSyntaxError');
	});

	it('syntax error severity is error', (t) => {
		t.assert.strictEqual(results[0].warnings[0].severity, 'error');
	});

	it('(CssSyntaxError) in warning text', (t) => {
		t.assert.ok(results[0].warnings[0].text.includes(' (CssSyntaxError)'));
	});
});

it('standalone passing file with syntax error', async (t) => {
	const { results } = await standalone({
		code: "a { color: 'red; }",
		codeFilename: path.join(dirname, 'syntax-error.css'),
		config: { rules: { 'block-no-empty': true } },
	});

	t.assert.ok(results[0].source.includes('syntax-error.css'));
});

it('syntax error sets errored to true', async (t) => {
	const { errored } = await standalone({
		code: "a { color: 'red; }",
		config: { rules: { 'block-no-empty': true } },
	});

	t.assert.strictEqual(errored, true);
});

it('error `Cannot parse selector` sets errored to true', async (t) => {
	const { errored } = await standalone({
		code: "data-something='true'] { }",
		config: { rules: { 'selector-type-no-unknown': true } },
	});

	t.assert.strictEqual(errored, true);
});

it('configuration error sets errored to true', async (t) => {
	const { errored } = await standalone({
		code: "a { color: 'red'; }",
		config: { rules: { 'block-no-empty': 'wahoo' } },
	});

	t.assert.strictEqual(errored, true);
});

it('unknown formatter option', async (t) => {
	await t.assert.rejects(
		standalone({
			formatter: 'unknown',
			code: '',
			config: { rules: { 'block-no-empty': 'wahoo' } },
		}),
		{ message: /^You must use a valid formatter option/ },
	);
});

describe('standalone with different configs per file', () => {
	let results;

	beforeEach(async () => {
		const data = await standalone({
			files: `${fixturesPath}/config-per-file/**/*.css`,
		});

		results = data.results;
	});

	it('no warnings for A', (t) => {
		const resultA = results.find((result) => result.source.includes('a.css'));

		t.assert.strictEqual(resultA.warnings.length, 0);
	});

	it('one warning for B', (t) => {
		const resultB = results.find((result) => result.source.includes('b.css'));

		t.assert.strictEqual(resultB.warnings.length, 1);
	});

	it('correct warning for B', (t) => {
		const resultB = results.find((result) => result.source.includes('b.css'));

		t.assert.ok(resultB.warnings[0].text.includes('Empty block'));
	});

	it('no warnings for C', (t) => {
		const resultC = results.find((result) => result.source.includes('c.css'));

		t.assert.strictEqual(resultC.warnings.length, 0);
	});

	it('no warnings for D', (t) => {
		const resultD = results.find((result) => result.source.includes('d.css'));

		t.assert.strictEqual(resultD.warnings.length, 0);
	});
});

describe('standalone with config locatable from process.cwd not file', () => {
	safeChdir(path.join(dirname, './fixtures/getConfigForFile/a/b'));

	let results;

	beforeEach(async () => {
		const data = await standalone({
			files: [replaceBackslashes(path.join(dirname, './fixtures/empty-block.css'))],
		});

		results = data.results;
	});

	it('two warning', (t) => {
		t.assert.strictEqual(results[0].warnings.length, 2);
	});

	it("'block-no-empty' correct warning", (t) => {
		t.assert.ok(results[0].warnings.find((warn) => warn.rule === 'block-no-empty'));
	});

	it("'plugin/warn-about-foo' correct warning", (t) => {
		t.assert.ok(results[0].warnings.find((warn) => warn.rule === 'plugin/warn-about-foo'));
	});
});

describe('standalone with config locatable from options.cwd not file', () => {
	let results;

	beforeEach(async () => {
		const data = await standalone({
			cwd: path.join(dirname, './fixtures/getConfigForFile/a/b'),
			files: [replaceBackslashes(path.join(dirname, './fixtures/empty-block.css'))],
		});

		results = data.results;
	});

	it('two warning', (t) => {
		t.assert.strictEqual(results[0].warnings.length, 2);
	});

	it("'block-no-empty' correct warning", (t) => {
		t.assert.ok(results[0].warnings.find((warn) => warn.rule === 'block-no-empty'));
	});

	it("'plugin/warn-about-foo' correct warning", (t) => {
		t.assert.ok(results[0].warnings.find((warn) => warn.rule === 'plugin/warn-about-foo'));
	});
});

describe('nonexistent codeFilename with loaded config', () => {
	safeChdir(path.join(dirname, './fixtures/getConfigForFile/a/b'));

	it('does not cause error', async (t) => {
		await t.assert.doesNotReject(
			standalone({
				code: 'a {}',
				codeFilename: 'does-not-exist.css',
			}),
		);
	});

	it('does load config from process.cwd', async (t) => {
		const { results } = await standalone({
			code: 'a {}',
			codeFilename: 'does-not-exist.css',
		});

		t.assert.strictEqual(results[0].warnings.length, 1);
	});
});

describe('nonexistent codeFilename with loaded config and options.cwd', () => {
	it('does not cause error', async (t) => {
		await t.assert.doesNotReject(
			standalone({
				code: 'a {}',
				codeFilename: 'does-not-exist.css',
				cwd: path.join(dirname, './fixtures/getConfigForFile/a/b'),
			}),
		);
	});

	it('does load config from options.cwd', async (t) => {
		const { results } = await standalone({
			code: 'a {}',
			codeFilename: 'does-not-exist.css',
			cwd: path.join(dirname, './fixtures/getConfigForFile/a/b'),
		});

		t.assert.strictEqual(results[0].warnings.length, 1);
	});
});

describe('existing codeFilename for nested config detection', () => {
	safeChdir(path.join(dirname, './fixtures/getConfigForFile'));

	it('loads config from a nested directory', async (t) => {
		const { results } = await standalone({
			code: 'a {}',
			codeFilename: 'a/b/foo.css',
		});

		t.assert.strictEqual(results[0].warnings.length, 1);
	});
});
