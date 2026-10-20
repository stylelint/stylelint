import { afterEach, beforeEach, describe, it, suite, test } from 'node:test';
import { copyFile, readFile, rm, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

import getCleanOutput from '../testUtils/getCleanOutput.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import safeChdir from '../testUtils/safeChdir.mjs';
import standalone from '../standalone.mjs';
import stripIndent from '../testUtils/stripIndent.mjs';
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

	assert.equal(result.code, 'a { color: #fff; }');
	assert.equal(result.report, '');
	assert.equal(result.results[0].autofixed, true);
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

	assert.equal(result.code, 'a { color: #fff; }');
	assert.equal(result.report, '');
	assert.equal(result.results[0].autofixed, true);
});

it("doesn't report autofixed when code input is ignored by config", async () => {
	const result = await standalone({
		code: 'a { color: #ffffff; }',
		codeFilename: fixturesPath('fix.css'),
		config: {
			ignoreFiles: fixturesPath('fix.css'),
			rules: {
				'color-hex-length': 'short',
			},
		},
		fix: true,
	});

	assert.equal(result.results[0].autofixed, undefined);
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

			assert.equal(
				result.code,
				stripIndent`
				:not(a):not(div) {}

				/* stylelint-disable */
				a { color: HSLA(); }

				/* stylelint-enable */

				a { color: hsla(); }
			`,
			);
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

			assert.equal(
				result.code,
				stripIndent`
				:not(A):not(DIV) {}

				/* stylelint-disable */
				:not(a, div) {}
				/* stylelint-enable */
			`,
			);
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

			assert.equal(
				result.code,
				stripIndent`
				/* stylelint-disable-next-line */
				a { color: HSLA(); }
				a { color: hsla(); }
			`,
			);
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

			assert.equal(
				result.code,
				stripIndent`
				a { color: hsla(); }
				a { color: HSLA(); } /* stylelint-disable-line */
			`,
			);
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

			assert.equal(
				result.code,
				stripIndent`
				/* stylelint-disable */
				.foo {}
				/* stylelint-enable */
				.bar {}
				/* stylelint-disable plugin/selector-no-foo */
				.foo {}
			`,
			);
		});

		test('node', async () => {
			await assert.rejects(
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
				{
					message:
						'The "plugin/selector-no-qux" rule provided incorrect position arguments to `utils.report()`. To fix, pass a PostCSS `node` to the function.',
				},
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

			assert.equal(result.code, '.bar {} /* stylelint-disable-line */');
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

			assert.equal(result.code, '.foo {}');
		});

		test('next-line', async () => {
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

			assert.equal(
				result.code,
				stripIndent`
					.bar {}
					/* stylelint-disable-next-line */
					.foo {}
			`,
			);
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

		assert.equal(result.code, code);
		assert.equal(result.report, '');
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

		assert.equal(result.code, code);
		assert.equal(result.report, '');
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

		assert.equal(result.code, code);
		assert.equal(result.report, '');
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

		assert.equal(
			result.code,
			'/* stylelint-disable declaration-block-no-duplicate-properties */ a { color: #fff; color: orange; }',
		);
		assert.equal(result.report, '');
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

		assert.equal(fileContent, postcssResult.root.toString(postcssResult.opts.syntax));

		assert.equal(result.code, undefined);
		assert.equal(
			getCleanOutput(result.report),
			stripIndent`
			stylesheet.css
			  1:1  ×  Unknown rule at-rule-name-case  at-rule-name-case
			  7:1  ×  Empty comment                   comment-no-empty

			× 2 problems (2 errors, 0 warnings)
		`,
		);
		assert.equal(result.results[0].autofixed, true);
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

		assert.equal(newFile, oldFile);

		assert.equal(result.code, undefined);
		assert.equal(getCleanOutput(result.report), '');
		assert.equal(result.results[0].autofixed, undefined);
	});

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

		assert.equal(fileContent.startsWith('\uFEFF'), true);
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

	assert.equal(result.results[0].errored, true);
	assert.equal(result.code, code);
	assert.equal(
		getCleanOutput(result.report),
		stripIndent`
		test.css
		  3:11  ×  Expected "#ffffff" to be "#fff"  color-hex-length

		× 1 problem (1 error, 0 warnings)
		  1 error potentially fixable with the "--fix" option.
	`,
	);
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

	assert.equal(
		warnings.some((w) => w.text === 'Expected "#ffffff" to be "#fff" (color-hex-length)'),
		true,
	);
	assert.equal(
		warnings.some(
			(w) => w.text === 'Duplicate selector "a", first used at line 2 (no-duplicate-selectors)',
		),
		true,
	);
	assert.equal(result.code, code);
	assert.equal(
		getCleanOutput(result.report),
		stripIndent`
		test.css
		  2:6   ×  Duplicate selector "a", first used at line 2  no-duplicate-selectors
		  3:11  ×  Expected "#ffffff" to be "#fff"               color-hex-length

		× 2 problems (2 errors, 0 warnings)
		  1 error potentially fixable with the "--fix" option.
	`,
	);
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

	assert.equal(
		warnings.some((w) => w.text === 'Expected "#ffffff" to be "#fff" (color-hex-length)'),
		false,
	);
	assert.equal(
		warnings.some(
			(w) => w.text === 'Duplicate selector "a", first used at line 2 (no-duplicate-selectors)',
		),
		true,
	);

	assert.equal(
		result.code,
		`
		a, a {
			color: #fff;
		}`,
	);
	assert.equal(
		getCleanOutput(result.report),
		stripIndent`
		test.css
		  2:6  ×  Duplicate selector "a", first used at line 2  no-duplicate-selectors

		× 1 problem (1 error, 0 warnings)
	`,
	);
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

	assert.equal(result.code, undefined);
	assert.equal(
		getCleanOutput(result.report),
		stripIndent`
		test.css
		  1:12  ×  Expected "#ffffff" to be "#fff"  color-hex-length

		× 1 problem (1 error, 0 warnings)
		  1 error potentially fixable with the "--fix" option.
	`,
	);
	assert.equal(result.results[0].autofixed, undefined);
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

	assert.equal(result.code, code);
	assert.equal(
		getCleanOutput(result.report),
		stripIndent`
		test.css
		  1:12  ×  Invalid hex color "#y3"  color-no-invalid-hex

		× 1 problem (1 error, 0 warnings)
	`,
	);
	assert.equal(result.results[0].autofixed, undefined);
});

it("doesn't return any fixed code if the fix option is false, regardless of plugin implementation", async () => {
	const code = `
		a {
			always: 1;
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

	assert.equal(result.code, undefined);
	assert.equal(result.results[0].autofixed, undefined);
});

/**
 * @see stylelint/stylelint#7735
 * @see stylelint/stylelint#2643
 */
it('returns partially fixed code if the fix option is true, depending on the plugin implementation', async () => {
	const code = stripIndent`
		a {
			always: 1;
			when-fixer: 3;
		}

		/* stylelint-disable */
		b {
			always: 1;
			when-fixer: 3;
		}
		/* stylelint-enable */

		/* stylelint-disable plugin/fixes */
		c {
			always: 1;
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

	assert.equal(
		result.code,
		stripIndent`
		a {
			always: fixed;
			when-fixer: fixed;
		}

		/* stylelint-disable */
		b {
			always: fixed;
			when-fixer: 3;
		}
		/* stylelint-enable */

		/* stylelint-disable plugin/fixes */
		c {
			always: fixed;
			when-fixer: 3;
		}
		/* stylelint-enable plugin/fixes */`,
	);
	assert.equal(result.report, '');
	assert.equal(result.results[0].autofixed, true);
});

it("doesn't return any fixed code if fixing is disabled for the rule, regardless of plugin implementation", async () => {
	const code = `
		a {
			always: 1;
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

	assert.equal(result.code, undefined);
	assert.equal(result.results[0].autofixed, undefined);
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

			assert.equal(result.errored, false);
			assert.equal(result.results[0].warnings.length, 0);
			assert.equal(result.code, cssWithSyntaxError);
			assert.equal(result.results[0].autofixed, undefined);
		});

		it('should fix incomplete rule', async () => {
			const result = await standalone({
				code: cssIncompleteRule,
				config,
				fix: 'lax',
			});

			assert.equal(result.errored, false);
			assert.equal(result.results[0].warnings.length, 0);
			assert.equal(result.code, expectedFixedIncompleteRule);
			assert.equal(result.results[0].autofixed, true);
		});

		it('should fix non-syntax errors', async () => {
			const result = await standalone({
				code: cssNonSyntaxError,
				config: nonSyntaxErrorConfig,
				fix: 'lax',
			});

			assert.equal(result.errored, false);
			assert.equal(result.results[0].warnings.length, 0);
			assert.equal(result.code, expectedFixedCode);
			assert.equal(result.results[0].autofixed, true);
		});
	});

	describe('with fix="strict"', () => {
		it('should throw error for syntax error', async () => {
			const result = await standalone({
				code: cssWithSyntaxError,
				config,
				fix: 'strict',
			});

			assert.equal(result.errored, true);
			assert.equal(result.results[0].warnings.length, 1);
			assert.equal(result.results[0].warnings[0].rule, 'CssSyntaxError');
			assert.equal(result.results[0].autofixed, undefined);
			assert.equal(result.code, undefined);
		});

		it('should throw error for incomplete rule', async () => {
			const result = await standalone({
				code: cssIncompleteRule,
				config,
				fix: 'strict',
			});

			assert.equal(result.errored, true);
			assert.equal(result.results[0].warnings.length, 1);
			assert.equal(result.results[0].warnings[0].rule, 'CssSyntaxError');
			assert.equal(result.results[0].autofixed, undefined);
			assert.equal(result.code, undefined);
		});

		it('should fix non-syntax errors', async () => {
			const result = await standalone({
				code: cssNonSyntaxError,
				config: nonSyntaxErrorConfig,
				fix: 'strict',
			});

			assert.equal(result.errored, false);
			assert.equal(result.results[0].warnings.length, 0);
			assert.equal(result.code, expectedFixedCode);
			assert.equal(result.results[0].autofixed, true);
		});
	});
});

describe('writing a fix of the byte order mark to a file', () => {
	safeChdir(new URL(`./tmp/standalone-fix-bom-${uniqueId()}`, import.meta.url));

	let tempFile;

	beforeEach(() => {
		tempFile = replaceBackslashes(path.join(process.cwd(), 'stylesheet.css'));
	});

	afterEach(async () => {
		await rm(tempFile, { force: true });
	});

	const lintFile = (primary) =>
		standalone({
			files: [tempFile],
			config: {
				plugins: [fixturesPath('./plugin-bom.mjs')],
				rules: {
					'plugin/bom': primary,
				},
			},
			fix: true,
		});

	it('writes the file when the fix removed the mark', async () => {
		await writeFile(tempFile, '\uFEFFa {}\n');

		const result = await lintFile('never');

		assert.equal(await readFile(tempFile, 'utf8'), 'a {}\n');
		assert.equal(result.results[0].autofixed, true);
		assert.deepEqual(result.results[0].warnings, []);
	});

	it('writes the file when the fix added the mark', async () => {
		await writeFile(tempFile, 'a {}\n');

		const result = await lintFile('always');

		assert.equal(await readFile(tempFile, 'utf8'), '\uFEFFa {}\n');
		assert.equal(result.results[0].autofixed, true);
		assert.deepEqual(result.results[0].warnings, []);
	});

	it('leaves the file alone when nothing was fixed', async () => {
		await writeFile(tempFile, '\uFEFFa {}\n');

		const result = await lintFile('always');

		assert.equal(await readFile(tempFile, 'utf8'), '\uFEFFa {}\n');
		assert.equal(result.results[0].autofixed, undefined);
	});
});
