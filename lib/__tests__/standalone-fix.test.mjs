import { copyFile, readFile, rm } from 'fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import safeChdir from '../testUtils/safeChdir.mjs';
import standalone from '../standalone.js';
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
	});

	expect(result.output).toBe('a { color: #fff; }');
});

it('fixes when enabled in config', async () => {
	const config = {
		fix: true,
		rules: {
			'color-hex-length': 'short',
		},
	};

	const { output } = await standalone({ code: 'a { color: #ffffff; }', config });

	expect(output).toBe('a { color: #fff; }');
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
	});

	expect(result.output).toBe(code);
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
	});

	expect(result.output).toBe(code);
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
	});

	expect(result.output).toBe(code);
});

it("doesn't fix with a scoped stylelint-disable command, but does fix other rules", async () => {
	const result = await standalone({
		code: '/* stylelint-disable declaration-block-no-duplicate-properties */ a { color: #ffffff; color: orange; }',
		config: {
			rules: {
				'color-hex-length': 'short',
				'declaration-block-no-duplicate-properties': true,
			},
		},
		fix: true,
	});

	expect(result.output).toBe(
		'/* stylelint-disable declaration-block-no-duplicate-properties */ a { color: #fff; color: orange; }',
	);
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

	it('overwrites the original file', async () => {
		const output = await standalone({
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

		const result = output.results[0]._postcssResult;

		const fileContent = await readFile(tempFile, 'utf8');

		expect(fileContent).toBe(result.root.toString(result.opts.syntax));
	});

	it("doesn't write to ignored file", async () => {
		await standalone({
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
		});

		const newFile = await readFile(tempFile, 'utf8');
		const oldFile = await readFile(fixturesPath('fix.css'), 'utf8');

		expect(newFile).toBe(oldFile);
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
	});

	expect(result.results[0].errored).toBe(true);
	expect(result.output).toBe(code);
});

it('two rules being disabled', async () => {
	const code = `
		a, a {
			color: #ffffff;
		}`;

	const result = await standalone({
		code,
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
	expect(result.output).toBe(code);
});

it('one rule being disabled and another still autofixing', async () => {
	const code = `
		a, a {
			color: #ffffff;
		}`;

	const result = await standalone({
		code,
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

	expect(result.output).toBe(`
		a, a {
			color: #fff;
		}`);
});
