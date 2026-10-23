import { describe, it } from 'node:test';

import postcssImport from 'postcss-import';

import { fileURLToPath } from 'node:url';
import path from 'node:path';

import standalone from '../standalone.mjs';
import stylelint from '../index.mjs';

const fixturesPath = fileURLToPath(new URL('./fixtures/config-reference-files', import.meta.url));

describe('standalone with referenceFiles', () => {
	describe('basic pipeline', () => {
		it('accepts referenceFiles as an array of { files } objects', async (t) => {
			const { results } = await standalone({
				code: 'a { color: red; }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'color-named': 'never' },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);
			t.assert.strictEqual(results[0].warnings[0].rule, 'color-named');
		});

		it('accepts referenceFiles as a bare string', async (t) => {
			const { results } = await standalone({
				code: 'a { animation-name: foo; }',
				config: {
					referenceFiles: 'tokens.css',
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('accepts referenceFiles as a bare object', async (t) => {
			const { results } = await standalone({
				code: 'a { animation-name: foo; }',
				config: {
					referenceFiles: { files: ['tokens.css'] },
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('accepts referenceFiles as an array of glob strings', async (t) => {
			const { results } = await standalone({
				code: 'a { animation-name: foo; }',
				config: {
					referenceFiles: ['tokens.css'],
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('accepts referenceFiles as a mixed array of strings and objects', async (t) => {
			const { results } = await standalone({
				code: 'a { animation-name: baz; }',
				config: {
					referenceFiles: ['tokens.css', { files: ['tokens.scss'], customSyntax: 'postcss-scss' }],
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('supports glob patterns in files', async (t) => {
			const { results } = await standalone({
				code: 'a { animation-name: bar; }',
				config: {
					referenceFiles: [{ files: ['tokens/*.css'] }],
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('throws when reference file does not exist', async (t) => {
			await t.assert.rejects(
				standalone({
					code: 'a {}',
					config: {
						referenceFiles: [{ files: ['nonexistent.css'] }],
						rules: {},
					},
					configBasedir: fixturesPath,
				}),
				{ message: /nonexistent\.css/ },
			);
		});

		it('throws when glob matches nothing', async (t) => {
			await t.assert.rejects(
				standalone({
					code: 'a {}',
					config: {
						referenceFiles: [{ files: ['no-match-*.css'] }],
						rules: {},
					},
					configBasedir: fixturesPath,
				}),
				{ message: /no-match-\*\.css/ },
			);
		});

		it('throws when reference file has parse errors', async (t) => {
			await t.assert.rejects(
				standalone({
					code: 'a {}',
					config: {
						referenceFiles: [{ files: ['malformed.css'] }],
						rules: {},
					},
					configBasedir: fixturesPath,
				}),
			);
		});

		it('throws for invalid referenceFiles shape (missing files property)', async (t) => {
			await t.assert.rejects(
				standalone({
					code: 'a {}',
					config: {
						referenceFiles: [{}],
						rules: {},
					},
					configBasedir: fixturesPath,
				}),
			);
		});
	});

	describe('no-unknown-animations', () => {
		it('suppresses warning when @keyframes is defined in reference file', async (t) => {
			const { results } = await standalone({
				code: 'a { animation-name: foo; }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('still warns for unknown animation names not in reference files', async (t) => {
			const { results } = await standalone({
				code: 'a { animation-name: unknown; }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);
			t.assert.strictEqual(results[0].warnings[0].rule, 'no-unknown-animations');
		});
	});

	describe('no-unknown-custom-properties', () => {
		it('suppresses warning when custom property is defined via :root in reference file', async (t) => {
			const { results } = await standalone({
				code: 'a { color: var(--bar); }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'no-unknown-custom-properties': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('suppresses warning when @property is defined in reference file', async (t) => {
			const { results } = await standalone({
				code: 'a { color: var(--baz); }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'no-unknown-custom-properties': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('still warns for unknown custom properties not in reference files', async (t) => {
			const { results } = await standalone({
				code: 'a { color: var(--unknown); }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'no-unknown-custom-properties': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);
			t.assert.strictEqual(results[0].warnings[0].rule, 'no-unknown-custom-properties');
		});
	});

	describe('custom-property-no-missing-var-function', () => {
		it('warns on a custom property defined via :root in reference file used without var()', async (t) => {
			const { results } = await standalone({
				code: 'a { color: --bar; }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'custom-property-no-missing-var-function': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);
			t.assert.strictEqual(results[0].warnings[0].rule, 'custom-property-no-missing-var-function');
		});

		it('warns on a custom property defined using @property in reference file used without var()', async (t) => {
			const { results } = await standalone({
				code: 'a { color: --baz; }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'custom-property-no-missing-var-function': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);
			t.assert.strictEqual(results[0].warnings[0].rule, 'custom-property-no-missing-var-function');
		});
	});

	describe('no-unknown-custom-media', () => {
		it('suppresses warning when @custom-media is defined in reference file', async (t) => {
			const { results } = await standalone({
				code: '@media (--qux) { a { color: red; } }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'no-unknown-custom-media': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('still warns for unknown custom media not in reference files', async (t) => {
			const { results } = await standalone({
				code: '@media (--unknown) { a { color: red; } }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'no-unknown-custom-media': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);
			t.assert.strictEqual(results[0].warnings[0].rule, 'no-unknown-custom-media');
		});
	});

	describe('declaration-property-value-no-unknown', () => {
		it('allows matching syntax for @property defined in reference file', async (t) => {
			const { results } = await standalone({
				code: 'a { --baz: red; }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'declaration-property-value-no-unknown': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('warns on incorrect syntax for @property defined in reference file', async (t) => {
			const { results } = await standalone({
				code: 'a { --baz: 10px; }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'declaration-property-value-no-unknown': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);
			t.assert.strictEqual(
				results[0].warnings[0].text,
				'Unknown value "10px" for property "--baz", registered as "<color>" (declaration-property-value-no-unknown)',
			);
		});

		it('warns on var() of a custom property declared in reference file', async (t) => {
			const { results } = await standalone({
				code: 'a { top: var(--bar); }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'declaration-property-value-no-unknown': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);
			t.assert.strictEqual(
				results[0].warnings[0].text,
				'Unknown value "red" for property "top", via "var(--bar)" (declaration-property-value-no-unknown)',
			);
		});

		it('warns on var() of a custom property defined using @property in reference file', async (t) => {
			const { results } = await standalone({
				code: 'a { top: var(--baz); }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'declaration-property-value-no-unknown': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);
			t.assert.strictEqual(
				results[0].warnings[0].text,
				'Unknown value "red" for property "top", via "var(--baz)" (declaration-property-value-no-unknown)',
			);
		});
	});

	describe('value-type-custom-property-required-list', () => {
		it('warns on a value beside a var() of a custom property declared in reference file', async (t) => {
			const { results } = await standalone({
				code: 'a { border: 1px solid var(--bar); }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					rules: { 'value-type-custom-property-required-list': ['color', 'length'] },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 1);
			t.assert.strictEqual(
				results[0].warnings[0].text,
				'Expected "1px" to be a custom property, as of type "<length>" (value-type-custom-property-required-list)',
			);
		});
	});

	describe('customSyntax support', () => {
		it('parses non-CSS file with customSyntax', async (t) => {
			const { results } = await standalone({
				code: 'a { animation-name: baz; }',
				config: {
					referenceFiles: [{ files: ['tokens.scss'], customSyntax: 'postcss-scss' }],
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('supports html documents', async (t) => {
			const { results } = await standalone({
				code: 'a { animation-name: bar; } b { animation-name: baz; }',
				config: {
					referenceFiles: [{ files: ['document.html'], customSyntax: 'postcss-html' }],
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});
	});

	describe('loader support', () => {
		it('adds CSS bundles as reference files', async (t) => {
			const { results } = await standalone({
				code: 'a { animation-name: bar; }',
				config: {
					referenceFiles: [{ files: ['entrypoint.css'], loader: 'postcss-import' }],
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		it('supports PostCSS plugin objects', async (t) => {
			const { results } = await standalone({
				code: 'a { animation-name: bar; }',
				config: {
					referenceFiles: [{ files: ['entrypoint.css'], loader: postcssImport() }],
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(results[0].warnings.length, 0);
		});

		describe('when a bundle embeds the linted file', () => {
			const targetFile = path.join(fixturesPath, 'embedded/target.css');
			const code = ':root { --x: 1px; }\n\na { top: var(--x); border: 1px solid var(--x); }';

			// The loader transforms the inlined copy, so the embedded values differ from the root's
			const loader = postcssImport({
				plugins: [
					{
						postcssPlugin: 'transform-inlined-custom-property',
						Declaration(decl) {
							if (decl.prop === '--x') decl.value = 'red';
						},
					},
				],
			});

			it('uses the embedded copy for declaration-property-value-no-unknown', async () => {
				const { results } = await standalone({
					code,
					codeFilename: targetFile,
					config: {
						referenceFiles: [{ files: ['embedded/entrypoint.css'], loader }],
						rules: { 'declaration-property-value-no-unknown': true },
					},
					configBasedir: fixturesPath,
				});

				expect(results).toHaveLength(1);
				expect(results[0].warnings).toHaveLength(1);
				expect(results[0].warnings[0].text).toBe(
					'Unknown value "red" for property "top", via "var(--x)" (declaration-property-value-no-unknown)',
				);
			});

			it('uses the embedded copy for value-type-custom-property-required-list', async () => {
				const { results } = await standalone({
					code,
					codeFilename: targetFile,
					config: {
						referenceFiles: [{ files: ['embedded/entrypoint.css'], loader }],
						rules: { 'value-type-custom-property-required-list': ['color', 'length'] },
					},
					configBasedir: fixturesPath,
				});

				expect(results).toHaveLength(1);
				expect(results[0].warnings).toHaveLength(1);
				expect(results[0].warnings[0].text).toBe(
					'Expected "1px" to be a custom property, as of type "<length>" (value-type-custom-property-required-list)',
				);
			});
		});
	});

	describe('plugin access', () => {
		it('inline plugin can read result.stylelint.referenceRoots', async (t) => {
			/** @type {import('postcss').Root[]} */
			let capturedRoots = [];

			const pluginRule = () => {
				return (/** @type {import('postcss').Root} */ root, /** @type {any} */ result) => {
					capturedRoots = result.stylelint.referenceRoots || [];
				};
			};

			pluginRule.ruleName = 'plugin/capture-reference-roots';
			pluginRule.messages = {};
			pluginRule.meta = {};

			const { results } = await standalone({
				code: 'a { color: red; }',
				config: {
					referenceFiles: [{ files: ['tokens.css'] }],
					plugins: [stylelint.createPlugin('plugin/capture-reference-roots', pluginRule)],
					rules: { 'plugin/capture-reference-roots': true },
				},
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(capturedRoots.length, 1);
			t.assert.strictEqual(capturedRoots[0].type, 'root');
		});

		it('without referenceFiles, plugin sees empty referenceRoots', async (t) => {
			/** @type {import('postcss').Root[]} */
			let capturedRoots = [];

			const pluginRule = () => {
				return (/** @type {import('postcss').Root} */ root, /** @type {any} */ result) => {
					capturedRoots = result.stylelint.referenceRoots || [];
				};
			};

			pluginRule.ruleName = 'plugin/capture-reference-roots';
			pluginRule.messages = {};
			pluginRule.meta = {};

			const { results } = await standalone({
				code: 'a { color: red; }',
				config: {
					plugins: [stylelint.createPlugin('plugin/capture-reference-roots', pluginRule)],
					rules: { 'plugin/capture-reference-roots': true },
				},
			});

			t.assert.strictEqual(results.length, 1);
			t.assert.strictEqual(capturedRoots.length, 0);
		});
	});

	describe('with overrides', () => {
		it('replaces top-level referenceFiles for matching files', async (t) => {
			const moduleFile = path.join(fixturesPath, 'test.module.css');
			const regularFile = path.join(fixturesPath, 'test.css');

			const config = {
				rules: {
					'no-unknown-animations': true,
					'no-unknown-custom-properties': true,
				},
				referenceFiles: ['tokens/animations.css'],
				overrides: [
					{
						files: ['**/*.module.css'],
						referenceFiles: ['tokens.css'],
					},
				],
			};

			// test.css: top-level referenceFiles applies (tokens/animations.css)
			const regularAnimationResult = await standalone({
				code: 'a { animation-name: bar; }',
				codeFilename: regularFile,
				config,
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(regularAnimationResult.results[0].warnings.length, 0);

			const regularCustomPropResult = await standalone({
				code: 'a { color: var(--bar); }',
				codeFilename: regularFile,
				config,
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(regularCustomPropResult.results[0].warnings.length, 1);
			t.assert.strictEqual(
				regularCustomPropResult.results[0].warnings[0].rule,
				'no-unknown-custom-properties',
			);

			// test.module.css: override replaces top-level to use tokens.css, not tokens/animations.css
			const moduleAnimationResult = await standalone({
				code: 'a { animation-name: bar; }',
				codeFilename: moduleFile,
				config,
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(moduleAnimationResult.results[0].warnings.length, 1);
			t.assert.strictEqual(
				moduleAnimationResult.results[0].warnings[0].rule,
				'no-unknown-animations',
			);

			const moduleCustomPropResult = await standalone({
				code: 'a { color: var(--bar); }',
				codeFilename: moduleFile,
				config,
				configBasedir: fixturesPath,
			});

			t.assert.strictEqual(moduleCustomPropResult.results[0].warnings.length, 0);
		});

		it('adds referenceFiles when only used in overrides', async (t) => {
			const moduleFile = path.join(fixturesPath, 'test.module.css');
			const regularFile = path.join(fixturesPath, 'test.css');

			const config = {
				rules: { 'no-unknown-animations': true },
				overrides: [
					{
						files: ['**/*.module.css'],
						referenceFiles: [{ files: ['tokens.css'] }],
					},
				],
			};

			const moduleResult = await standalone({
				code: 'a { animation-name: foo; }',
				codeFilename: moduleFile,
				config,
				configBasedir: fixturesPath,
			});

			// module.css file has referenceFiles and animation "foo" is known
			t.assert.strictEqual(moduleResult.results.length, 1);
			t.assert.strictEqual(moduleResult.results[0].warnings.length, 0);

			const regularResult = await standalone({
				code: 'a { animation-name: foo; }',
				codeFilename: regularFile,
				config,
				configBasedir: fixturesPath,
			});

			// regular css file doesn't have referenceFiles and animation "foo" is unknown
			t.assert.strictEqual(regularResult.results.length, 1);
			t.assert.strictEqual(regularResult.results[0].warnings.length, 1);
			t.assert.strictEqual(regularResult.results[0].warnings[0].rule, 'no-unknown-animations');
		});
	});
});
