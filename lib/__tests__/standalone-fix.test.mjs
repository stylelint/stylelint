import { afterEach, beforeEach, describe, it, suite, test } from 'node:test';
import { copyFile, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

import assertItemsPartialDeepStrictEqual from '../testUtils/assertItemsPartialDeepStrictEqual.mjs';
import getCleanOutput from '../testUtils/getCleanOutput.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import safeChdir from '../testUtils/safeChdir.mjs';
import standalone from '../standalone.mjs';
import stripIndent from '../testUtils/stripIndent.mjs';
import uniqueId from '../testUtils/uniqueId.mjs';

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

it('outputs fixed code when input is code string', async (t) => {
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

	t.assert.strictEqual(result.code, 'a { color: #fff; }');
	t.assert.strictEqual(result.report, '');
	t.assert.strictEqual(result.results[0].autofixed, true);
});

it('fixes when enabled in config', async (t) => {
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

	t.assert.strictEqual(result.code, 'a { color: #fff; }');
	t.assert.strictEqual(result.report, '');
	t.assert.strictEqual(result.results[0].autofixed, true);
});

it("doesn't report autofixed when code input is ignored by config", async (t) => {
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

	t.assert.strictEqual(result.results[0].autofixed, undefined);
});

describe('fix callback', () => {
	suite('core rules', () => {
		test('out of range', async (t) => {
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

			t.assert.strictEqual(
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

		test('same line', async (t) => {
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

			t.assert.strictEqual(
				result.code,
				stripIndent`
				:not(A):not(DIV) {}

				/* stylelint-disable */
				:not(a, div) {}
				/* stylelint-enable */
			`,
			);
		});

		test('stylelint-disable-next-line', async (t) => {
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

			t.assert.strictEqual(
				result.code,
				stripIndent`
				/* stylelint-disable-next-line */
				a { color: HSLA(); }
				a { color: hsla(); }
			`,
			);
		});

		test('stylelint-disable-line', async (t) => {
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

			t.assert.strictEqual(
				result.code,
				stripIndent`
				a { color: hsla(); }
				a { color: HSLA(); } /* stylelint-disable-line */
			`,
			);
		});
	});

	suite('plugin', () => {
		test('scoped + unscoped', async (t) => {
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

			t.assert.strictEqual(
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

		test('node', async (t) => {
			await t.assert.rejects(
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

		test('ignoreDisables', async (t) => {
			const result = await standalone({
				code: '.foo {} /* stylelint-disable-line */',
				config: {
					plugins: [fixturesPath('./plugin-fixer.mjs')],
					rules: { 'plugin/selector-no-foo': true },
					fix: true,
					ignoreDisables: true,
				},
			});

			t.assert.strictEqual(result.code, '.bar {} /* stylelint-disable-line */');
		});

		test('disableFix secondary option', async (t) => {
			const result = await standalone({
				code: '.foo {}',
				config: {
					plugins: [fixturesPath('./plugin-fixer.mjs')],
					rules: { 'plugin/selector-no-foo': [true, { disableFix: true }] },
					fix: true,
				},
			});

			t.assert.strictEqual(result.code, '.foo {}');
		});

		test('next-line', async (t) => {
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

			t.assert.strictEqual(
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
	it("doesn't fix with stylelint-disable commands", async (t) => {
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

		t.assert.strictEqual(result.code, code);
		t.assert.strictEqual(result.report, '');
	});

	it("doesn't fix with scoped stylelint-disable commands", async (t) => {
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

		t.assert.strictEqual(result.code, code);
		t.assert.strictEqual(result.report, '');
	});

	it("doesn't fix with multiple scoped stylelint-disable commands", async (t) => {
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

		t.assert.strictEqual(result.code, code);
		t.assert.strictEqual(result.report, '');
	});

	it("doesn't fix with a scoped stylelint-disable command, but does fix other rules", async (t) => {
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

		t.assert.strictEqual(
			result.code,
			'/* stylelint-disable declaration-block-no-duplicate-properties */ a { color: #fff; color: orange; }',
		);
		t.assert.strictEqual(result.report, '');
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

	it('overwrites the original file and returns unfixable errors', async (t) => {
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

		t.assert.strictEqual(fileContent, postcssResult.root.toString(postcssResult.opts.syntax));

		t.assert.strictEqual(result.code, undefined);
		t.assert.strictEqual(
			getCleanOutput(result.report),
			stripIndent`
			stylesheet.css
			  1:1  ×  Unknown rule at-rule-name-case  at-rule-name-case
			  7:1  ×  Empty comment                   comment-no-empty

			× 2 problems (2 errors, 0 warnings)
		`,
		);
		t.assert.strictEqual(result.results[0].autofixed, true);
	});

	it("doesn't write to ignored file", async (t) => {
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

		t.assert.strictEqual(newFile, oldFile);

		t.assert.strictEqual(result.code, undefined);
		t.assert.strictEqual(getCleanOutput(result.report), '');
		t.assert.strictEqual(result.results[0].autofixed, undefined);
	});

	it.skip("doesn't strip BOM", async (t) => {
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

		t.assert.strictEqual(fileContent.startsWith('\uFEFF'), true);
	});
});

it('one rule being disabled', async (t) => {
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

	t.assert.strictEqual(result.results[0].errored, true);
	t.assert.strictEqual(result.code, code);
	t.assert.strictEqual(
		getCleanOutput(result.report),
		stripIndent`
		test.css
		  3:11  ×  Expected "#ffffff" to be "#fff"  color-hex-length

		× 1 problem (1 error, 0 warnings)
		  1 error potentially fixable with the "--fix" option.
	`,
	);
});

it('two rules being disabled', async (t) => {
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

	t.assert.strictEqual(
		warnings.some((w) => w.text === 'Expected "#ffffff" to be "#fff" (color-hex-length)'),
		true,
	);
	t.assert.strictEqual(
		warnings.some(
			(w) => w.text === 'Duplicate selector "a", first used at line 2 (no-duplicate-selectors)',
		),
		true,
	);
	t.assert.strictEqual(result.code, code);
	t.assert.strictEqual(
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

it('one rule being disabled and another still autofixing', async (t) => {
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

	t.assert.strictEqual(
		warnings.some((w) => w.text === 'Expected "#ffffff" to be "#fff" (color-hex-length)'),
		false,
	);
	t.assert.strictEqual(
		warnings.some(
			(w) => w.text === 'Duplicate selector "a", first used at line 2 (no-duplicate-selectors)',
		),
		true,
	);

	t.assert.strictEqual(
		result.code,
		`
		a, a {
			color: #fff;
		}`,
	);
	t.assert.strictEqual(
		getCleanOutput(result.report),
		stripIndent`
		test.css
		  2:6  ×  Duplicate selector "a", first used at line 2  no-duplicate-selectors

		× 1 problem (1 error, 0 warnings)
	`,
	);
});

it("doesn't return the fixed code if the fix option is false", async (t) => {
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

	t.assert.strictEqual(result.code, undefined);
	t.assert.strictEqual(
		getCleanOutput(result.report),
		stripIndent`
		test.css
		  1:12  ×  Expected "#ffffff" to be "#fff"  color-hex-length

		× 1 problem (1 error, 0 warnings)
		  1 error potentially fixable with the "--fix" option.
	`,
	);
	t.assert.strictEqual(result.results[0].autofixed, undefined);
});

it('returns the original code if the fix option is true but the code is not fixable', async (t) => {
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

	t.assert.strictEqual(result.code, code);
	t.assert.strictEqual(
		getCleanOutput(result.report),
		stripIndent`
		test.css
		  1:12  ×  Invalid hex color "#y3"  color-no-invalid-hex

		× 1 problem (1 error, 0 warnings)
	`,
	);
	t.assert.strictEqual(result.results[0].autofixed, undefined);
});

it("doesn't return any fixed code if the fix option is false, regardless of plugin implementation", async (t) => {
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

	t.assert.strictEqual(result.code, undefined);
	t.assert.strictEqual(result.results[0].autofixed, undefined);
});

/**
 * @see stylelint/stylelint#7735
 * @see stylelint/stylelint#2643
 */
it('returns partially fixed code if the fix option is true, depending on the plugin implementation', async (t) => {
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

	t.assert.strictEqual(
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
	t.assert.strictEqual(result.report, '');
	t.assert.strictEqual(result.results[0].autofixed, true);
});

it("doesn't return any fixed code if fixing is disabled for the rule, regardless of plugin implementation", async (t) => {
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

	t.assert.strictEqual(result.code, undefined);
	t.assert.strictEqual(result.results[0].autofixed, undefined);
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
		it('should not throw error and return same code for syntax error', async (t) => {
			const result = await standalone({
				code: cssWithSyntaxError,
				config,
				fix: 'lax',
			});

			t.assert.strictEqual(result.errored, false);
			t.assert.strictEqual(result.results[0].warnings.length, 0);
			t.assert.strictEqual(result.code, cssWithSyntaxError);
			t.assert.strictEqual(result.results[0].autofixed, undefined);
		});

		it('should fix incomplete rule', async (t) => {
			const result = await standalone({
				code: cssIncompleteRule,
				config,
				fix: 'lax',
			});

			t.assert.strictEqual(result.errored, false);
			t.assert.strictEqual(result.results[0].warnings.length, 0);
			t.assert.strictEqual(result.code, expectedFixedIncompleteRule);
			t.assert.strictEqual(result.results[0].autofixed, true);
		});

		it('should fix non-syntax errors', async (t) => {
			const result = await standalone({
				code: cssNonSyntaxError,
				config: nonSyntaxErrorConfig,
				fix: 'lax',
			});

			t.assert.strictEqual(result.errored, false);
			t.assert.strictEqual(result.results[0].warnings.length, 0);
			t.assert.strictEqual(result.code, expectedFixedCode);
			t.assert.strictEqual(result.results[0].autofixed, true);
		});
	});

	describe('with fix="strict"', () => {
		it('should throw error for syntax error', async (t) => {
			const result = await standalone({
				code: cssWithSyntaxError,
				config,
				fix: 'strict',
			});

			t.assert.strictEqual(result.errored, true);
			t.assert.strictEqual(result.results[0].warnings.length, 1);
			t.assert.strictEqual(result.results[0].warnings[0].rule, 'CssSyntaxError');
			t.assert.strictEqual(result.results[0].autofixed, undefined);
			t.assert.strictEqual(result.code, undefined);
		});

		it('should throw error for incomplete rule', async (t) => {
			const result = await standalone({
				code: cssIncompleteRule,
				config,
				fix: 'strict',
			});

			t.assert.strictEqual(result.errored, true);
			t.assert.strictEqual(result.results[0].warnings.length, 1);
			t.assert.strictEqual(result.results[0].warnings[0].rule, 'CssSyntaxError');
			t.assert.strictEqual(result.results[0].autofixed, undefined);
			t.assert.strictEqual(result.code, undefined);
		});

		it('should fix non-syntax errors', async (t) => {
			const result = await standalone({
				code: cssNonSyntaxError,
				config: nonSyntaxErrorConfig,
				fix: 'strict',
			});

			t.assert.strictEqual(result.errored, false);
			t.assert.strictEqual(result.results[0].warnings.length, 0);
			t.assert.strictEqual(result.code, expectedFixedCode);
			t.assert.strictEqual(result.results[0].autofixed, true);
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

	it('writes the file when the fix removed the mark', async (t) => {
		await writeFile(tempFile, '\uFEFFa {}\n');

		const result = await lintFile('never');

		t.assert.strictEqual(await readFile(tempFile, 'utf8'), 'a {}\n');
		t.assert.strictEqual(result.results[0].autofixed, true);
		t.assert.deepStrictEqual(result.results[0].warnings, []);
	});

	it('writes the file when the fix added the mark', async (t) => {
		await writeFile(tempFile, 'a {}\n');

		const result = await lintFile('always');

		t.assert.strictEqual(await readFile(tempFile, 'utf8'), '\uFEFFa {}\n');
		t.assert.strictEqual(result.results[0].autofixed, true);
		t.assert.deepStrictEqual(result.results[0].warnings, []);
	});

	it('leaves the file alone when nothing was fixed', async (t) => {
		await writeFile(tempFile, '\uFEFFa {}\n');

		const result = await lintFile('always');

		t.assert.strictEqual(await readFile(tempFile, 'utf8'), '\uFEFFa {}\n');
		t.assert.strictEqual(result.results[0].autofixed, undefined);
	});
});

describe('running the rules again after a fix', () => {
	it('fixes a problem introduced for a rule that already ran', async (t) => {
		const result = await standalone({
			code: 'a { -webkit-transition: opacity 1s; transition: opacity 1s; }',
			config: {
				rules: {
					'declaration-block-no-duplicate-properties': true,
					'property-no-vendor-prefix': true,
				},
			},
			fix: true,
			formatter: 'string',
		});

		t.assert.strictEqual(result.code, 'a { transition: opacity 1s; }');
		t.assert.strictEqual(result.report, '');
	});

	it('reports a problem introduced for a rule that has no fix', async (t) => {
		const result = await standalone({
			code: 'a:not(.b, .c) {}',
			config: {
				rules: {
					'selector-max-pseudo-class': 1,
					'selector-not-notation': 'simple',
				},
			},
			fix: true,
		});

		t.assert.strictEqual(result.code, 'a:not(.b):not(.c) {}');
		assertItemsPartialDeepStrictEqual(result.results[0].warnings, [
			{ rule: 'selector-max-pseudo-class' },
		]);
	});

	it('stops after ten passes when fixers undo each other and reports what remains', async (t) => {
		const result = await standalone({
			code: 'a { color: red; }',
			config: {
				plugins: [fixturesPath('./plugin-fixers-undo-each-other.mjs')],
				rules: {
					'plugin/value-a': true,
					'plugin/value-b': true,
				},
			},
			fix: true,
		});

		t.assert.strictEqual(result.code, 'a { color: b; }');
		assertItemsPartialDeepStrictEqual(result.results[0].warnings, [
			{ rule: 'plugin/value-a', text: 'Expected "b" to be "a" (plugin/value-a)' },
		]);
		t.assert.deepStrictEqual(result.results[0]._postcssResult.stylelint.fixersData, {
			'plugin/value-a': 10,
			'plugin/value-b': 10,
		});
	});
});

describe("running a rule after another rule's fix", () => {
	it('shows a fixed value to a later rule that reads `decl.value`', async (t) => {
		const result = await standalone({
			code: 'a { color: #ffffff/* foo */; }',
			config: {
				rules: {
					'color-hex-length': 'short',
					'declaration-property-value-disallowed-list': { color: ['#ffffff'] },
				},
			},
			fix: true,
			formatter: 'string',
		});

		t.assert.strictEqual(result.code, 'a { color: #fff/* foo */; }');
		t.assert.strictEqual(result.report, '');
	});

	it('shows a new value assigned over its raw to a later rule that reads the raw', async (t) => {
		const result = await standalone({
			code: 'a { color: red/* foo */; }',
			config: {
				plugins: [fixturesPath('./plugin-fixer-assigns-value.mjs')],
				rules: {
					'plugin/fixer-assigns-value': true,
					'color-no-hex': true,
				},
			},
			fix: true,
		});

		t.assert.strictEqual(result.code, 'a { color: #ffffff; }');
		assertItemsPartialDeepStrictEqual(result.results[0].warnings, [{ rule: 'color-no-hex' }]);
	});

	it('shows a fixed selector to a rule that read the block in an earlier pass', async (t) => {
		const result = await standalone({
			code: 'a::-moz-placeholder,\nb { color: red; }',
			config: {
				rules: {
					'declaration-empty-line-before': ['always', { ignore: ['inside-single-line-block'] }],
					'selector-no-vendor-prefix': true,
				},
			},
			fix: true,
			formatter: 'string',
		});

		t.assert.strictEqual(result.code, 'a::placeholder,\nb { color: red; }');
		t.assert.strictEqual(result.report, '');
	});
});
