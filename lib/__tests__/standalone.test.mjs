import { fileURLToPath } from 'node:url';
import path from 'node:path';

import NoFilesFoundError from '../utils/noFilesFoundError.js';
import readJSONFile from '../testUtils/readJSONFile.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.js';
import safeChdir from '../testUtils/safeChdir.mjs';
import standalone from '../standalone.js';

const configBlockNoEmpty = readJSONFile(
	new URL('./fixtures/config-block-no-empty.json', import.meta.url),
);

const fixturesPath = replaceBackslashes(new URL('./fixtures', import.meta.url));

const __dirname = fileURLToPath(new URL('.', import.meta.url));

describe('standalone with one input file', () => {
	let output;
	let results;

	beforeEach(async () => {
		const data = await standalone({
			files: `${fixturesPath}/empty-block.css`,
			// Path to config file
			configFile: path.join(__dirname, 'fixtures/config-block-no-empty.json'),
		});

		output = data.output;
		results = data.results;
	});

	it('triggers warning', () => {
		expect(output).toContain('block-no-empty');
		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

it('standalone with two file-specific globs', async () => {
	const { output, results } = await standalone({
		files: [`${fixturesPath}/e*y-block.*`, `${fixturesPath}/invalid-h*.css`],
		config: {
			rules: { 'block-no-empty': true, 'color-no-invalid-hex': true },
		},
	});

	expect(output).toContain('block-no-empty');
	expect(output).toContain('color-no-invalid-hex');
	expect(results).toHaveLength(2);
	expect(results[0].warnings).toHaveLength(1);
	expect(results[1].warnings).toHaveLength(1);

	/**
	 * Expecting warnings for these two rules, and order of warnings is not important,
	 * because files could be linted in any order
	 * [
	 * 	{ warnings: [{ rule: 'block-no-empty' }] },
	 * 	{ warnings: [{ rule: 'color-no-invalid-hex' }] },
	 * ]
	 */
	expect(results).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				warnings: expect.arrayContaining([
					expect.objectContaining({
						rule: 'block-no-empty',
					}),
				]),
			}),
			expect.objectContaining({
				warnings: expect.arrayContaining([
					expect.objectContaining({
						rule: 'color-no-invalid-hex',
					}),
				]),
			}),
		]),
	);
});

describe('standalone with files and globbyOptions', () => {
	let output;
	let results;

	beforeEach(async () => {
		const data = await standalone({
			files: 'empty-block.css',
			globbyOptions: { cwd: fixturesPath },
			// Path to config file
			configFile: path.join(__dirname, 'fixtures/config-block-no-empty.json'),
		});

		output = data.output;
		results = data.results;
	});

	it('triggers warning', () => {
		expect(output).toContain('block-no-empty');
		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

describe('standalone with files and cwd', () => {
	let output;
	let results;

	beforeEach(async () => {
		const data = await standalone({
			files: 'empty-block.css',
			cwd: fixturesPath,
			// Path to config file
			configFile: path.join(__dirname, 'fixtures/config-block-no-empty.json'),
		});

		output = data.output;
		results = data.results;
	});

	it('triggers warning', () => {
		expect(output).toContain('block-no-empty');
		expect(results).toHaveLength(1);
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].rule).toBe('block-no-empty');
	});
});

it('standalone with input css', async () => {
	const { output, results } = await standalone({
		code: 'a {}',
		config: configBlockNoEmpty,
	});

	expect(typeof output).toBe('string');
	expect(results).toHaveLength(1);
	expect(results[0].warnings).toHaveLength(1);
	expect(results[0].warnings[0].rule).toBe('block-no-empty');
});

it('standalone without input css and file(s) should throw error', async () => {
	const expectedError = new Error(
		'You must pass stylelint a `files` glob or a `code` string, though not both',
	);

	await expect(() => standalone({ config: configBlockNoEmpty })).rejects.toThrow(expectedError);
});

it('standalone with nonexistent-file throws an error', async () => {
	const files = `${fixturesPath}/nonexistent-file.css`;
	const expectedError = new NoFilesFoundError(files);

	await expect(
		standalone({
			files,
			config: configBlockNoEmpty,
		}),
	).rejects.toThrow(expectedError);
});

it('standalone with nonexistent-file and allowEmptyInput enabled quietly exits', async () => {
	const { results, errored, output } = await standalone({
		files: `${fixturesPath}/nonexistent-file.css`,
		config: configBlockNoEmpty,
		allowEmptyInput: true,
	});

	expect(results).toHaveLength(0);
	expect(errored).toBe(false);
	expect(output).toBe('[]');
});

it('standalone with nonexistent-file and allowEmptyInput enabled (in config) quietly exits', async () => {
	const { results, errored, output } = await standalone({
		files: `${fixturesPath}/nonexistent-file.css`,
		config: { ...configBlockNoEmpty, allowEmptyInput: true },
	});

	expect(results).toHaveLength(0);
	expect(errored).toBe(false);
	expect(output).toBe('[]');
});

it('standalone with nonexistent-file and allowEmptyInput enabled (in config file) quietly exits', async () => {
	const { results, errored, output } = await standalone({
		files: `${fixturesPath}/nonexistent-file.css`,
		configFile: `${fixturesPath}/config-allow-empty-input.json`,
	});

	expect(results).toHaveLength(0);
	expect(errored).toBe(false);
	expect(output).toBe('[]');
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

	it('<input css 1> as source', () => {
		expect(results[0].source).toBe('<input css 1>');
	});

	it('empty deprecations', () => {
		expect(results[0].deprecations).toHaveLength(0);
	});

	it('empty invalidOptionWarnings', () => {
		expect(results[0].invalidOptionWarnings).toHaveLength(0);
	});

	it('empty parseError', () => {
		expect(results[0].parseErrors).toHaveLength(0);
	});

	it('error registered', () => {
		expect(results[0].errored).toBeTruthy();
	});

	it('syntax error rule is CssSyntaxError', () => {
		expect(results[0].warnings).toHaveLength(1);
		expect(results[0].warnings[0].rule).toBe('CssSyntaxError');
	});

	it('syntax error severity is error', () => {
		expect(results[0].warnings[0].severity).toBe('error');
	});

	it('(CssSyntaxError) in warning text', () => {
		expect(results[0].warnings[0].text).toContain(' (CssSyntaxError)');
	});
});

it('standalone passing file with syntax error', async () => {
	const { results } = await standalone({
		code: "a { color: 'red; }",
		codeFilename: path.join(__dirname, 'syntax-error.css'),
		config: { rules: { 'block-no-empty': true } },
	});

	expect(results[0].source).toContain('syntax-error.css');
});

it('syntax error sets errored to true', async () => {
	const { errored } = await standalone({
		code: "a { color: 'red; }",
		config: { rules: { 'block-no-empty': true } },
	});

	expect(errored).toBe(true);
});

it('error `Cannot parse selector` sets errored to true', async () => {
	const { errored } = await standalone({
		code: "data-something='true'] { }",
		config: { rules: { 'selector-type-no-unknown': true } },
	});

	expect(errored).toBe(true);
});

it('configuration error sets errored to true', async () => {
	const { errored } = await standalone({
		code: "a { color: 'red'; }",
		config: { rules: { 'block-no-empty': 'wahoo' } },
	});

	expect(errored).toBe(true);
});

it('unknown formatter option', async () => {
	await expect(
		standalone({
			formatter: 'unknown',
			code: '',
			config: { rules: { 'block-no-empty': 'wahoo' } },
		}),
	).rejects.toThrow(/^You must use a valid formatter option/);
});

describe('standalone with different configs per file', () => {
	let results;

	beforeEach(async () => {
		const data = await standalone({
			files: `${fixturesPath}/config-per-file/**/*.css`,
		});

		results = data.results;
	});

	it('no warnings for A', () => {
		const resultA = results.find((result) => result.source.includes('a.css'));

		expect(resultA.warnings).toHaveLength(0);
	});

	it('one warning for B', () => {
		const resultB = results.find((result) => result.source.includes('b.css'));

		expect(resultB.warnings).toHaveLength(1);
	});

	it('correct warning for B', () => {
		const resultB = results.find((result) => result.source.includes('b.css'));

		expect(resultB.warnings[0].text).toContain('Unexpected empty block');
	});

	it('no warnings for C', () => {
		const resultC = results.find((result) => result.source.includes('c.css'));

		expect(resultC.warnings).toHaveLength(0);
	});

	it('no warnings for D', () => {
		const resultD = results.find((result) => result.source.includes('d.css'));

		expect(resultD.warnings).toHaveLength(0);
	});
});

describe('standalone with config locatable from process.cwd not file', () => {
	safeChdir(path.join(__dirname, './fixtures/getConfigForFile/a/b'));

	let results;

	beforeEach(async () => {
		const data = await standalone({
			files: [replaceBackslashes(path.join(__dirname, './fixtures/empty-block.css'))],
		});

		results = data.results;
	});

	it('two warning', () => {
		expect(results[0].warnings).toHaveLength(2);
	});

	it("'block-no-empty' correct warning", () => {
		expect(results[0].warnings.find((warn) => warn.rule === 'block-no-empty')).toBeTruthy();
	});

	it("'plugin/warn-about-foo' correct warning", () => {
		expect(results[0].warnings.find((warn) => warn.rule === 'plugin/warn-about-foo')).toBeTruthy();
	});
});

describe('standalone with config locatable from options.cwd not file', () => {
	let results;

	beforeEach(async () => {
		const data = await standalone({
			cwd: path.join(__dirname, './fixtures/getConfigForFile/a/b'),
			files: [replaceBackslashes(path.join(__dirname, './fixtures/empty-block.css'))],
		});

		results = data.results;
	});

	it('two warning', () => {
		expect(results[0].warnings).toHaveLength(2);
	});

	it("'block-no-empty' correct warning", () => {
		expect(results[0].warnings.find((warn) => warn.rule === 'block-no-empty')).toBeTruthy();
	});

	it("'plugin/warn-about-foo' correct warning", () => {
		expect(results[0].warnings.find((warn) => warn.rule === 'plugin/warn-about-foo')).toBeTruthy();
	});
});

describe('nonexistent codeFilename with loaded config', () => {
	safeChdir(path.join(__dirname, './fixtures/getConfigForFile/a/b'));

	it('does not cause error', async () => {
		await expect(() =>
			standalone({
				code: 'a {}',
				codeFilename: 'does-not-exist.css',
			}),
		).not.toThrow();
	});

	it('does load config from process.cwd', async () => {
		const { results } = await standalone({
			code: 'a {}',
			codeFilename: 'does-not-exist.css',
		});

		expect(results[0].warnings).toHaveLength(1);
	});
});

describe('nonexistent codeFilename with loaded config and options.cwd', () => {
	it('does not cause error', async () => {
		await expect(() =>
			standalone({
				code: 'a {}',
				codeFilename: 'does-not-exist.css',
				cwd: path.join(__dirname, './fixtures/getConfigForFile/a/b'),
			}),
		).not.toThrow();
	});

	it('does load config from options.cwd', async () => {
		const { results } = await standalone({
			code: 'a {}',
			codeFilename: 'does-not-exist.css',
			cwd: path.join(__dirname, './fixtures/getConfigForFile/a/b'),
		});

		expect(results[0].warnings).toHaveLength(1);
	});
});

describe('existing codeFilename for nested config detection', () => {
	safeChdir(path.join(__dirname, './fixtures/getConfigForFile'));

	it('loads config from a nested directory', async () => {
		const { results } = await standalone({
			code: 'a {}',
			codeFilename: 'a/b/foo.css',
		});

		expect(results[0].warnings).toHaveLength(1);
	});
});
