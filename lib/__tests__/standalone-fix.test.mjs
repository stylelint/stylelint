import { copyFile, readFile, rm } from 'fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

import { stripIndent } from 'common-tags';

import getCleanOutput from '../testUtils/getCleanOutput.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import safeChdir from '../testUtils/safeChdir.mjs';
import standalone from '../standalone.mjs';
import uniqueId from '../testUtils/uniqueId.mjs';

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

it('outputs fixed code when input is code string', async () => {
	const result = await standalone({
		code: 'a { color: #ffffff; }',
		config: {
			rules: {
				'color-hex-length': 'short',
			},
		},
		fix: true,
		formatter: 'string',
	});

	expect(result.code).toBe('a { color: #fff; }');
	expect(result.report).toBe('');
});

it('fixes when enabled in config', async () => {
	const result = await standalone({
		code: 'a { color: #ffffff; }',
		config: {
			fix: true,
			rules: {
				'color-hex-length': 'short',
			},
		},
		formatter: 'string',
	});

	expect(result.code).toBe('a { color: #fff; }');
	expect(result.report).toBe('');
});

it("doesn't fix with stylelint-disable commands", async () => {
	const code = `
		/* stylelint-disable */
		a { color: #ffffff; }`;

	const result = await standalone({
		code,
		config: {
			rules: {
				'color-hex-length': 'short',
			},
		},
		fix: true,
		formatter: 'string',
	});

	expect(result.code).toBe(code);
	expect(result.report).toBe('');
});

it("doesn't fix with scoped stylelint-disable commands", async () => {
	const code = `
		/* stylelint-disable color-hex-length */
		a { color: #ffffff; }`;

	const result = await standalone({
		code,
		config: {
			rules: {
				'color-hex-length': 'short',
			},
		},
		fix: true,
		formatter: 'string',
	});

	expect(result.code).toBe(code);
	expect(result.report).toBe('');
});

it("doesn't fix with multiple scoped stylelint-disable commands", async () => {
	const code = `
		/* stylelint-disable declaration-block-no-duplicate-properties, color-hex-length */
		a {
			color: #ffffff;
			color: orange;
		}`;

	const result = await standalone({
		code,
		config: {
			rules: {
				'color-hex-length': 'short',
				'declaration-block-no-duplicate-properties': true,
			},
		},
		fix: true,
		formatter: 'string',
	});

	expect(result.code).toBe(code);
	expect(result.report).toBe('');
});

it("doesn't fix with a scoped stylelint-disable command, but does fix other rules", async () => {
	const code =
		'/* stylelint-disable declaration-block-no-duplicate-properties */ a { color: #ffffff; color: orange; }';

	const result = await standalone({
		code,
		config: {
			rules: {
				'color-hex-length': 'short',
				'declaration-block-no-duplicate-properties': true,
			},
		},
		fix: true,
		formatter: 'string',
	});

	expect(result.code).toBe(
		'/* stylelint-disable declaration-block-no-duplicate-properties */ a { color: #fff; color: orange; }',
	);
	expect(result.report).toBe('');
});

describe('writing fixes to files', () => {
	safeChdir(new URL(`./tmp/standalone-fix-${uniqueId()}`, import.meta.url));

	let tempFile;

	beforeEach(async () => {
		tempFile = replaceBackslashes(path.join(process.cwd(), 'stylesheet.css'));

		await copyFile(fixturesPath('fix.css'), tempFile);
	});

	afterEach(async () => {
		await rm(tempFile, { force: true });
	});

	it('overwrites the original file and returns unfixable errors', async () => {
		const result = await standalone({
			files: [tempFile],
			config: {
				rules: {
					'at-rule-name-case': 'lower',
					'comment-empty-line-before': 'always',
					'comment-no-empty': true,
				},
			},
			fix: true,
			formatter: 'string',
		});

		const postcssResult = result.results[0]._postcssResult;

		const fileContent = await readFile(tempFile, 'utf8');

		expect(fileContent).toBe(postcssResult.root.toString(postcssResult.opts.syntax));

		expect(result.code).toBeUndefined();
		expect(getCleanOutput(result.report)).toBe(stripIndent`
			stylesheet.css
			 1:1  ×  Unknown rule at-rule-name-case  at-rule-name-case
			 7:1  ×  Unexpected empty comment        comment-no-empty

			2 problems (2 errors, 0 warnings)
		`);
	});

	it("doesn't write to ignored file", async () => {
		const result = await standalone({
			files: [tempFile],
			config: {
				ignoreFiles: tempFile,
				rules: {
					'at-rule-name-case': 'lower',
					'comment-empty-line-before': 'always',
					'comment-no-empty': true,
				},
			},
			fix: true,
			formatter: 'string',
		});

		const newFile = await readFile(tempFile, 'utf8');
		const oldFile = await readFile(fixturesPath('fix.css'), 'utf8');

		expect(newFile).toBe(oldFile);

		expect(result.code).toBeUndefined();
		expect(getCleanOutput(result.report)).toBe('');
	});

	// eslint-disable-next-line jest/no-disabled-tests
	it.skip("doesn't strip BOM", async () => {
		await standalone({
			files: [tempFile],
			config: {
				rules: {
					'at-rule-name-case': 'lower',
					'comment-empty-line-before': 'always',
					'comment-no-empty': true,
				},
			},
			fix: true,
		});

		const fileContent = await readFile(tempFile, 'utf8');

		expect(fileContent.startsWith('\uFEFF')).toBe(true);
	});
});

it('one rule being disabled', async () => {
	const code = `
		a {
			color: #ffffff;
		}`;

	const result = await standalone({
		code,
		codeFilename: 'test.css',
		config: {
			rules: {
				'color-hex-length': [
					'short',
					{
						disableFix: true,
					},
				],
			},
		},
		fix: true,
		formatter: 'string',
	});

	expect(result.results[0].errored).toBe(true);
	expect(result.code).toBe(code);
	expect(getCleanOutput(result.report)).toBe(stripIndent`
		test.css
		 3:11  ×  Expected "#ffffff" to be "#fff"  color-hex-length

		1 problem (1 error, 0 warnings)
	`);
});

it('two rules being disabled', async () => {
	const code = `
		a, a {
			color: #ffffff;
		}`;

	const result = await standalone({
		code,
		codeFilename: 'test.css',
		config: {
			rules: {
				'color-hex-length': [
					'short',
					{
						disableFix: true,
					},
				],
				'no-duplicate-selectors': [
					true,
					{
						disableFix: true,
					},
				],
			},
		},
		fix: true,
		formatter: 'string',
	});

	const warnings = result.results[0].warnings;

	expect(
		warnings.some((w) => w.text === 'Expected "#ffffff" to be "#fff" (color-hex-length)'),
	).toBe(true);
	expect(
		warnings.some(
			(w) =>
				w.text ===
				'Unexpected duplicate selector "a", first used at line 2 (no-duplicate-selectors)',
		),
	).toBe(true);
	expect(result.code).toBe(code);
	expect(getCleanOutput(result.report)).toBe(stripIndent`
		test.css
		 2:3   ×  Unexpected duplicate selector "a", first used at line 2  no-duplicate-selectors
		 3:11  ×  Expected "#ffffff" to be "#fff"                          color-hex-length

		2 problems (2 errors, 0 warnings)
	`);
});

it('one rule being disabled and another still autofixing', async () => {
	const code = `
		a, a {
			color: #ffffff;
		}`;

	const result = await standalone({
		code,
		codeFilename: 'test.css',
		config: {
			rules: {
				'color-hex-length': ['short'],
				'no-duplicate-selectors': [
					true,
					{
						disableFix: true,
					},
				],
			},
		},
		fix: true,
		formatter: 'string',
	});

	const warnings = result.results[0].warnings;

	expect(
		warnings.some((w) => w.text === 'Expected "#ffffff" to be "#fff" (color-hex-length)'),
	).toBe(false);
	expect(
		warnings.some(
			(w) =>
				w.text ===
				'Unexpected duplicate selector "a", first used at line 2 (no-duplicate-selectors)',
		),
	).toBe(true);

	expect(result.code).toBe(`
		a, a {
			color: #fff;
		}`);
	expect(getCleanOutput(result.report)).toBe(stripIndent`
		test.css
		 2:3  ×  Unexpected duplicate selector "a", first used at line 2  no-duplicate-selectors

		1 problem (1 error, 0 warnings)
	`);
});

it("doesn't return the fixed code if the fix option is false", async () => {
	const result = await standalone({
		code: 'a { color: #ffffff; }',
		codeFilename: 'test.css',
		config: {
			rules: {
				'color-hex-length': 'short',
			},
		},
		fix: false,
		formatter: 'string',
	});

	expect(result.code).toBeUndefined();
	expect(getCleanOutput(result.report)).toBe(stripIndent`
		test.css
		 1:12  ×  Expected "#ffffff" to be "#fff"  color-hex-length

		1 problem (1 error, 0 warnings)
	`);
});

it('returns the original code if the fix option is true but the code is not fixable', async () => {
	const code = 'a { color: #y3 }';

	const result = await standalone({
		code,
		codeFilename: 'test.css',
		config: {
			rules: {
				'color-no-invalid-hex': true,
			},
		},
		fix: true,
		formatter: 'string',
	});

	expect(result.code).toBe(code);
	expect(getCleanOutput(result.report)).toBe(stripIndent`
		test.css
		 1:12  ×  Unexpected invalid hex color "#y3"  color-no-invalid-hex

		1 problem (1 error, 0 warnings)
	`);
});
