import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

import { copyFile, readFile, rm } from 'fs/promises';
import { jest, describe as suite } from '@jest/globals';
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

describe('fix callback', () => {
	suite('core rules', () => {
		test('out of range', async () => {
			const code = stripIndent`
				:not(
					a,
					div
				) {}

				/* stylelint-disable */
				a { color: HSLA(); }

				/* stylelint-enable */

				a { color: HSLA(); }
			`;

			const result = await standalone({
				code,
				config: {
					rules: {
						'selector-not-notation': 'simple',
						'function-name-case': 'lower',
					},
				},
				fix: true,
			});

			expect(result.code).toBe(stripIndent`
				:not(a):not(div) {}

				/* stylelint-disable */
				a { color: HSLA(); }

				/* stylelint-enable */

				a { color: hsla(); }
			`);
		});

		test('same line', async () => {
			const code = stripIndent`
				:not(a, div) {}

				/* stylelint-disable */
				:not(a, div) {}
				/* stylelint-enable */
			`;

			const result = await standalone({
				code,
				config: {
					rules: {
						'selector-not-notation': 'simple',
						'selector-type-case': 'upper',
					},
				},
				fix: true,
			});

			expect(result.code).toBe(stripIndent`
				:not(A):not(DIV) {}

				/* stylelint-disable */
				:not(a, div) {}
				/* stylelint-enable */
			`);
		});

		test('stylelint-disable-next-line', async () => {
			const code = stripIndent`
				/* stylelint-disable-next-line */
				a { color: HSLA(); }
				a { color: HSLA(); }
			`;

			const result = await standalone({
				code,
				config: {
					rules: {
						'function-name-case': 'lower',
					},
				},
				fix: true,
			});

			expect(result.code).toBe(stripIndent`
				/* stylelint-disable-next-line */
				a { color: HSLA(); }
				a { color: hsla(); }
			`);
		});

		test('stylelint-disable-line', async () => {
			const code = stripIndent`
				a { color: HSLA(); }
				a { color: HSLA(); } /* stylelint-disable-line */
			`;

			const result = await standalone({
				code,
				config: {
					rules: {
						'function-name-case': 'lower',
					},
				},
				fix: true,
			});

			expect(result.code).toBe(stripIndent`
				a { color: hsla(); }
				a { color: HSLA(); } /* stylelint-disable-line */
			`);
		});
	});

	suite('plugin', () => {
		test('scoped + unscoped', async () => {
			const result = await standalone({
				code: stripIndent`
					/* stylelint-disable */
					.foo {}
					/* stylelint-enable */
					.foo {}
					/* stylelint-disable plugin/selector-no-foo */
					.foo {}
				`,
				config: {
					plugins: [fixturesPath('./plugin-fixer.mjs')],
					rules: { 'plugin/selector-no-foo': true },
					fix: true,
				},
			});

			expect(result.code).toBe(stripIndent`
				/* stylelint-disable */
				.foo {}
				/* stylelint-enable */
				.bar {}
				/* stylelint-disable plugin/selector-no-foo */
				.foo {}
			`);
		});

		test('node', async () => {
			return expect(
				standalone({
					code: `
						/* stylelint-disable */
						.qux {}
					`,
					config: {
						plugins: [fixturesPath('./plugin-fixer-buggy.mjs')],
						rules: { 'plugin/selector-no-qux': true },
						fix: true,
					},
				}),
			).rejects.toThrow(
				'The "plugin/selector-no-qux" rule failed to pass either a node or a line number to the `report()` function.',
			);
		});

		test('ignoreDisables', async () => {
			const result = await standalone({
				code: '.foo {} /* stylelint-disable-line */',
				config: {
					plugins: [fixturesPath('./plugin-fixer.mjs')],
					rules: { 'plugin/selector-no-foo': true },
					fix: true,
					ignoreDisables: true,
				},
			});

			expect(result.code).toBe('.bar {} /* stylelint-disable-line */');
		});

		test('disableFix secondary option', async () => {
			const result = await standalone({
				code: '.foo {}',
				config: {
					plugins: [fixturesPath('./plugin-fixer.mjs')],
					rules: { 'plugin/selector-no-foo': [true, { disableFix: true }] },
					fix: true,
				},
			});

			expect(result.code).toBe('.foo {}');
		});

		test('next-line: with a fixer', async () => {
			const result = await standalone({
				code: stripIndent`
					.foo {}
					/* stylelint-disable-next-line */
					.foo {}
				`,
				config: {
					plugins: [fixturesPath('./plugin-fixer.mjs')],
					rules: { 'plugin/selector-no-foo': true },
					fix: true,
				},
			});

			expect(result.code).toBe(stripIndent`
					.bar {}
					/* stylelint-disable-next-line */
					.foo {}
			`);
		});

		test('next-line: without a fixer', async () => {
			const result = await standalone({
				code: stripIndent`
					.foo {}
					/* stylelint-disable-next-line */
					.foo {}
				`,
				config: {
					plugins: [fixturesPath('./plugin-selector-no-foo.mjs')],
					rules: { 'plugin/selector-no-foo': true },
					fix: true,
				},
			});

			expect(result.code).toBe(stripIndent`
					.foo {}
					/* stylelint-disable-next-line */
					.foo {}
			`);
		});

		test('scoped: with (disabled) + without (enabled)', async () => {
			const result = await standalone({
				code: stripIndent`
					.foo {}
					.qux {}
					/* stylelint-disable plugin/selector-no-foo */
					.foo {}
				`,
				config: {
					plugins: [
						fixturesPath('./plugin-fixer.mjs'),
						fixturesPath('./plugin-selector-no-qux.mjs'),
					],
					rules: {
						'plugin/selector-no-foo': true,
						'plugin/selector-no-qux': true,
					},
					fix: true,
				},
			});

			expect(result.code).toBe(stripIndent`
				.bar {}
				.baz {}
				/* stylelint-disable plugin/selector-no-foo */
				.foo {}
			`);
		});

		test('scoped: with (enabled) + without (disabled)', async () => {
			const result = await standalone({
				code: stripIndent`
					.qux {}
					.foo {}
					/* stylelint-disable plugin/selector-no-qux */
					.qux {}
				`,
				config: {
					plugins: [
						fixturesPath('./plugin-fixer.mjs'),
						fixturesPath('./plugin-selector-no-qux.mjs'),
					],
					rules: {
						'plugin/selector-no-foo': true,
						'plugin/selector-no-qux': true,
					},
					fix: true,
				},
			});

			expect(result.code).toBe(stripIndent`
					.qux {}
					.bar {}
					/* stylelint-disable plugin/selector-no-qux */
					.qux {}
			`);
		});
	});
});

describe('stylelint commands', () => {
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

	test('deprecated context.fix', async () => {
		const mock = jest.spyOn(process, 'emitWarning').mockImplementation(() => {});
		const result = await standalone({
			code: stripIndent`
				/* stylelint-disable */
				.foo {}
				.foo {}
			`,
			config: {
				plugins: [fixturesPath('./plugin-selector-no-foo.mjs')],
				rules: { 'plugin/selector-no-foo': true },
				fix: true,
			},
		});

		expect(result.code).toBe(stripIndent`
				/* stylelint-disable */
				.foo {}
				.foo {}
		`);
		expect(mock).toHaveBeenCalledTimes(1);
		expect(mock).toHaveBeenCalledWith('`context.fix` is being deprecated.', {
			code: 'stylelint:005',
			detail:
				'Please pass a `fix` callback to the `report` utility of "plugin/selector-no-foo" instead.',
			type: 'DeprecationWarning',
		});

		mock.mockClear();
	});
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

			× 2 problems (2 errors, 0 warnings)
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

		× 1 problem (1 error, 0 warnings)
		  1 error potentially fixable with the "--fix" option.
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
		  2:6   ×  Unexpected duplicate selector "a", first used at line 2  no-duplicate-selectors
		  3:11  ×  Expected "#ffffff" to be "#fff"                          color-hex-length

		× 2 problems (2 errors, 0 warnings)
		  1 error potentially fixable with the "--fix" option.
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
		  2:6  ×  Unexpected duplicate selector "a", first used at line 2  no-duplicate-selectors

		× 1 problem (1 error, 0 warnings)
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

		× 1 problem (1 error, 0 warnings)
		  1 error potentially fixable with the "--fix" option.
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

		× 1 problem (1 error, 0 warnings)
	`);
});

it("doesn't return any fixed code if the fix option is false, regardless of plugin implementation", async () => {
	const code = `
		a {
			always: 1;
			when-context: 2;
			when-fixer: 3;
		}`;

	const result = await standalone({
		code,
		config: {
			plugins: [fixturesPath('./plugin-fixes.mjs')],
			rules: {
				'plugin/fixes': true,
			},
		},
		fix: false,
	});

	expect(result.code).toBeUndefined();
});

/**
 * @see stylelint/stylelint#7735
 * @see stylelint/stylelint#2643
 */
it('returns partially fixed code if the fix option is true, depending on the plugin implementation', async () => {
	const code = stripIndent`
		a {
			always: 1;
			when-context: 2;
			when-fixer: 3;
		}

		/* stylelint-disable */
		b {
			always: 1;
			when-context: 2;
			when-fixer: 3;
		}
		/* stylelint-enable */

		/* stylelint-disable plugin/fixes */
		c {
			always: 1;
			when-context: 2;
			when-fixer: 3;
		}
		/* stylelint-enable plugin/fixes */`;

	const result = await standalone({
		code,
		config: {
			plugins: [fixturesPath('./plugin-fixes.mjs')],
			rules: {
				'plugin/fixes': true,
			},
		},
		fix: true,
		formatter: 'string',
	});

	expect(result.code).toBe(stripIndent`
		a {
			always: fixed;
			when-context: 2;
			when-fixer: fixed;
		}

		/* stylelint-disable */
		b {
			always: fixed;
			when-context: 2;
			when-fixer: 3;
		}
		/* stylelint-enable */

		/* stylelint-disable plugin/fixes */
		c {
			always: fixed;
			when-context: 2;
			when-fixer: 3;
		}
		/* stylelint-enable plugin/fixes */`);
	expect(result.report).toBe('');
});

it("doesn't return any fixed code if fixing is disabled for the rule, regardless of plugin implementation", async () => {
	const code = `
		a {
			always: 1;
			when-context: 2;
			when-fixer: 3;
		}`;

	const result = await standalone({
		code,
		config: {
			plugins: [fixturesPath('./plugin-fixes.mjs')],
			rules: {
				'plugin/fixes': [true, { disableFix: true }],
			},
		},
		fix: false,
	});

	expect(result.code).toBeUndefined();
});

suite('standalone with fix options for CSS syntax errors', () => {
	const cssWithSyntaxError = '// comment';
	const cssIncompleteRule = 'a {';
	const expectedFixedIncompleteRule = 'a {}';
	const cssNonSyntaxError = 'a { colr: hsl(20, 10%, 30%, 5%); }';
	const expectedFixedCode = 'a { colr: hsl(20deg 10% 30% / 5%); }';
	const config = {
		rules: {},
	};
	const nonSyntaxErrorConfig = {
		rules: {
			'color-function-notation': 'modern',
			'hue-degree-notation': 'angle',
		},
	};

	describe('with fix="lax"', () => {
		it('should not throw error and return same code for syntax error', async () => {
			const result = await standalone({
				code: cssWithSyntaxError,
				config,
				fix: 'lax',
			});

			expect(result.errored).toBe(false);
			expect(result.results[0].warnings).toHaveLength(0);
			expect(result.code).toBe(cssWithSyntaxError);
		});

		it('should fix incomplete rule', async () => {
			const result = await standalone({
				code: cssIncompleteRule,
				config,
				fix: 'lax',
			});

			expect(result.errored).toBe(false);
			expect(result.results[0].warnings).toHaveLength(0);
			expect(result.code).toBe(expectedFixedIncompleteRule);
		});

		it('should fix non-syntax errors', async () => {
			const result = await standalone({
				code: cssNonSyntaxError,
				config: nonSyntaxErrorConfig,
				fix: 'lax',
			});

			expect(result.errored).toBe(false);
			expect(result.results[0].warnings).toHaveLength(0);
			expect(result.code).toBe(expectedFixedCode);
		});
	});

	describe('with fix="strict"', () => {
		it('should throw error for syntax error', async () => {
			const result = await standalone({
				code: cssWithSyntaxError,
				config,
				fix: 'strict',
			});

			expect(result.errored).toBe(true);
			expect(result.results[0].warnings).toHaveLength(1);
			expect(result.results[0].warnings[0].rule).toBe('CssSyntaxError');
		});

		it('should throw error for incomplete rule', async () => {
			const result = await standalone({
				code: cssIncompleteRule,
				config,
				fix: 'strict',
			});

			expect(result.errored).toBe(true);
			expect(result.results[0].warnings).toHaveLength(1);
			expect(result.results[0].warnings[0].rule).toBe('CssSyntaxError');
		});

		it('should fix non-syntax errors', async () => {
			const result = await standalone({
				code: cssNonSyntaxError,
				config: nonSyntaxErrorConfig,
				fix: 'strict',
			});

			expect(result.errored).toBe(false);
			expect(result.results[0].warnings).toHaveLength(0);
			expect(result.code).toBe(expectedFixedCode);
		});
	});
});
