import { copyFile, readFile, rm } from 'fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { stripIndent, stripIndents } from 'common-tags';

import replaceBackslashes from '../testUtils/replaceBackslashes.js';
import safeChdir from '../testUtils/safeChdir.js';
import standalone from '../standalone.js';
import uniqueId from '../testUtils/uniqueId.js';

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

it('outputs fixed code when input is code string', async () => {
	const result = await standalone({
		code: '  a { color: red; }',
		config: {
			rules: {
				indentation: 2,
			},
		},
		fix: true,
	});

	expect(result.output).toBe('a { color: red; }');
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

it('apply indentation autofix at last', async () => {
	const result = await standalone({
		code: 'a {\nbox-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.2), inset 0 1px 2px 0 rgba(0, 0, 0, 0.1);\n}',
		config: {
			rules: {
				indentation: 2,
				'value-list-comma-newline-after': 'always',
			},
		},
		fix: true,
	});

	expect(result.output).toBe(
		'a {\n  box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.1),\n    0 0 0 1px rgba(0, 0, 0, 0.2),\n    inset 0 1px 2px 0 rgba(0, 0, 0, 0.1);\n}',
	);
});

it("doesn't fix with stylelint-disable commands", async () => {
	const code = `
		/* stylelint-disable */
		a {
			color: red;
		}`;

	const result = await standalone({
		code,
		config: {
			rules: {
				indentation: 2,
			},
		},
		fix: true,
	});

	expect(result.output).toBe(code);
});

it("doesn't fix with scoped stylelint-disable commands", async () => {
	const code = `
		/* stylelint-disable indentation */
		a {
			color: red;
		}`;

	const result = await standalone({
		code,
		config: {
			rules: {
				indentation: 2,
			},
		},
		fix: true,
	});

	expect(result.output).toBe(code);
});

it("doesn't fix with multiple scoped stylelint-disable commands", async () => {
	const code = `
		/* stylelint-disable indentation, color-hex-length */
		a {
			color: #ffffff;
		}`;

	const result = await standalone({
		code,
		config: {
			rules: {
				indentation: 2,
				'color-hex-length': 'short',
			},
		},
		fix: true,
	});

	expect(result.output).toBe(code);
});

it("the color-hex-length rule doesn't fix with scoped stylelint-disable commands", async () => {
	const result = await standalone({
		code: stripIndent`
			/* stylelint-disable color-hex-length */
			a {
				color: #ffffff;
			}`,
		config: {
			rules: {
				indentation: 2,
				'color-hex-length': 'short',
			},
		},
		fix: true,
	});

	expect(result.output).toBe(stripIndent`
		/* stylelint-disable color-hex-length */
		a {
		  color: #ffffff;
		}`);
});

it("the indentation rule doesn't fix with scoped stylelint-disable commands", async () => {
	const result = await standalone({
		code: stripIndent`
			/* stylelint-disable indentation */
			a {
				color: #ffffff;
			}`,
		config: {
			rules: {
				indentation: 2,
				'color-hex-length': 'short',
			},
		},
		fix: true,
	});

	expect(result.output).toBe(stripIndent`
		/* stylelint-disable indentation */
		a {
			color: #fff;
		}`);
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
			color: red;
		}`;

	const result = await standalone({
		code,
		config: {
			rules: {
				indentation: [
					2,
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
		a {
			COLOR: red;
		}`;

	const result = await standalone({
		code,
		config: {
			rules: {
				indentation: [
					2,
					{
						disableFix: true,
					},
				],
				'property-case': [
					'lower',
					{
						disableFix: true,
					},
				],
			},
		},
		fix: true,
	});

	const warnings = result.results[0].warnings;

	expect(warnings.some((w) => w.text === 'Expected indentation of 0 spaces (indentation)')).toBe(
		true,
	);
	expect(warnings.some((w) => w.text === 'Expected "COLOR" to be "color" (property-case)')).toBe(
		true,
	);
	expect(result.output).toBe(code);
});

it('one rule being disabled and another still autofixing', async () => {
	// use stripIndent to remove first linebreak that is also removed in the stripIndents expect
	const code = stripIndent`
		a {
			COLOR: red;
		}`;

	const result = await standalone({
		code,
		config: {
			rules: {
				indentation: [0],
				'property-case': [
					'lower',
					{
						disableFix: true,
					},
				],
			},
		},
		fix: true,
	});

	const warnings = result.results[0].warnings;

	expect(warnings.some((w) => w.text === 'Expected indentation of 0 spaces (indentation)')).toBe(
		false,
	);
	expect(warnings.some((w) => w.text === 'Expected "COLOR" to be "color" (property-case)')).toBe(
		true,
	);
	expect(result.output).toBe(stripIndents(code));
});
