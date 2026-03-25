import { fileURLToPath } from 'node:url';
import path from 'node:path';

import standalone from '../standalone.mjs';
import stylelint from '../index.mjs';

const fixturesPath = fileURLToPath(new URL('./fixtures/config-semantics', import.meta.url));

describe('standalone with semantics', () => {
	describe('basic pipeline', () => {
		it('accepts semantics as an array of { files } objects', async () => {
			const { results } = await standalone({
				code: 'a { color: red; }',
				config: {
					semantics: [{ files: ['tokens.css'] }],
					rules: { 'color-named': 'never' },
				},
				configBasedir: fixturesPath,
			});

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);
			expect(results[0].warnings[0].rule).toBe('color-named');
		});

		it('supports glob patterns in files', async () => {
			const { results } = await standalone({
				code: 'a { animation-name: bar; }',
				config: {
					semantics: [{ files: ['tokens/*.css'] }],
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(0);
		});

		it('throws when semantic file does not exist', async () => {
			await expect(
				standalone({
					code: 'a {}',
					config: {
						semantics: [{ files: ['nonexistent.css'] }],
						rules: {},
					},
					configBasedir: fixturesPath,
				}),
			).rejects.toThrow(/nonexistent\.css/);
		});

		it('throws when glob matches nothing', async () => {
			await expect(
				standalone({
					code: 'a {}',
					config: {
						semantics: [{ files: ['no-match-*.css'] }],
						rules: {},
					},
					configBasedir: fixturesPath,
				}),
			).rejects.toThrow(/no-match-\*\.css/);
		});

		it('throws when semantic file has parse errors', async () => {
			await expect(
				standalone({
					code: 'a {}',
					config: {
						semantics: [{ files: ['malformed.css'] }],
						rules: {},
					},
					configBasedir: fixturesPath,
				}),
			).rejects.toThrow();
		});

		it('throws for invalid semantics shape (string instead of array)', async () => {
			await expect(
				standalone({
					code: 'a {}',
					config: {
						semantics: 'tokens.css',
						rules: {},
					},
					configBasedir: fixturesPath,
				}),
			).rejects.toThrow();
		});

		it('throws for invalid semantics shape (missing files property)', async () => {
			await expect(
				standalone({
					code: 'a {}',
					config: {
						semantics: [{}],
						rules: {},
					},
					configBasedir: fixturesPath,
				}),
			).rejects.toThrow();
		});
	});

	describe('no-unknown-animations', () => {
		it('suppresses warning when @keyframes is defined in semantic file', async () => {
			const { results } = await standalone({
				code: 'a { animation-name: foo; }',
				config: {
					semantics: [{ files: ['tokens.css'] }],
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(0);
		});

		it('still warns for unknown animation names not in semantic files', async () => {
			const { results } = await standalone({
				code: 'a { animation-name: unknown; }',
				config: {
					semantics: [{ files: ['tokens.css'] }],
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);
			expect(results[0].warnings[0].rule).toBe('no-unknown-animations');
		});
	});

	describe('no-unknown-custom-properties', () => {
		it('suppresses warning when custom property is defined via :root in semantic file', async () => {
			const { results } = await standalone({
				code: 'a { color: var(--bar); }',
				config: {
					semantics: [{ files: ['tokens.css'] }],
					rules: { 'no-unknown-custom-properties': true },
				},
				configBasedir: fixturesPath,
			});

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(0);
		});

		it('suppresses warning when @property is defined in semantic file', async () => {
			const { results } = await standalone({
				code: 'a { color: var(--baz); }',
				config: {
					semantics: [{ files: ['tokens.css'] }],
					rules: { 'no-unknown-custom-properties': true },
				},
				configBasedir: fixturesPath,
			});

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(0);
		});

		it('still warns for unknown custom properties not in semantic files', async () => {
			const { results } = await standalone({
				code: 'a { color: var(--unknown); }',
				config: {
					semantics: [{ files: ['tokens.css'] }],
					rules: { 'no-unknown-custom-properties': true },
				},
				configBasedir: fixturesPath,
			});

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);
			expect(results[0].warnings[0].rule).toBe('no-unknown-custom-properties');
		});
	});

	describe('no-unknown-custom-media', () => {
		it('suppresses warning when @custom-media is defined in semantic file', async () => {
			const { results } = await standalone({
				code: '@media (--qux) { a { color: red; } }',
				config: {
					semantics: [{ files: ['tokens.css'] }],
					rules: { 'no-unknown-custom-media': true },
				},
				configBasedir: fixturesPath,
			});

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(0);
		});

		it('still warns for unknown custom media not in semantic files', async () => {
			const { results } = await standalone({
				code: '@media (--unknown) { a { color: red; } }',
				config: {
					semantics: [{ files: ['tokens.css'] }],
					rules: { 'no-unknown-custom-media': true },
				},
				configBasedir: fixturesPath,
			});

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(1);
			expect(results[0].warnings[0].rule).toBe('no-unknown-custom-media');
		});
	});

	describe('customSyntax support', () => {
		it('parses non-CSS file with customSyntax', async () => {
			const { results } = await standalone({
				code: 'a { animation-name: baz; }',
				config: {
					semantics: [{ files: ['tokens.scss'], customSyntax: 'postcss-scss' }],
					rules: { 'no-unknown-animations': true },
				},
				configBasedir: fixturesPath,
			});

			expect(results).toHaveLength(1);
			expect(results[0].warnings).toHaveLength(0);
		});
	});

	describe('plugin access', () => {
		it('inline plugin can read result.stylelint.semanticRoots', async () => {
			/** @type {import('postcss').Root[]} */
			let capturedRoots = [];

			const pluginRule = () => {
				return (/** @type {import('postcss').Root} */ root, /** @type {any} */ result) => {
					capturedRoots = result.stylelint.semanticRoots || [];
				};
			};

			pluginRule.ruleName = 'plugin/capture-semantic-roots';
			pluginRule.messages = {};
			pluginRule.meta = {};

			const { results } = await standalone({
				code: 'a { color: red; }',
				config: {
					semantics: [{ files: ['tokens.css'] }],
					plugins: [stylelint.createPlugin('plugin/capture-semantic-roots', pluginRule)],
					rules: { 'plugin/capture-semantic-roots': true },
				},
				configBasedir: fixturesPath,
			});

			expect(results).toHaveLength(1);
			expect(capturedRoots).toHaveLength(1);
			expect(capturedRoots[0].type).toBe('root');
		});

		it('without semantics, plugin sees empty semanticRoots', async () => {
			/** @type {import('postcss').Root[]} */
			let capturedRoots = [];

			const pluginRule = () => {
				return (/** @type {import('postcss').Root} */ root, /** @type {any} */ result) => {
					capturedRoots = result.stylelint.semanticRoots || [];
				};
			};

			pluginRule.ruleName = 'plugin/capture-semantic-roots';
			pluginRule.messages = {};
			pluginRule.meta = {};

			const { results } = await standalone({
				code: 'a { color: red; }',
				config: {
					plugins: [stylelint.createPlugin('plugin/capture-semantic-roots', pluginRule)],
					rules: { 'plugin/capture-semantic-roots': true },
				},
			});

			expect(results).toHaveLength(1);
			expect(capturedRoots).toHaveLength(0);
		});
	});

	describe('semantics inside overrides', () => {
		it('scoped to matching files only', async () => {
			const moduleFile = path.join(fixturesPath, 'test.module.css');
			const regularFile = path.join(fixturesPath, 'test.css');

			const config = {
				rules: { 'no-unknown-animations': true },
				overrides: [
					{
						files: ['**/*.module.css'],
						semantics: [{ files: ['tokens.css'] }],
					},
				],
			};

			const moduleResult = await standalone({
				code: 'a { animation-name: foo; }',
				codeFilename: moduleFile,
				config,
				configBasedir: fixturesPath,
			});

			// module.css file has semantics and animation "foo" is known
			expect(moduleResult.results).toHaveLength(1);
			expect(moduleResult.results[0].warnings).toHaveLength(0);

			const regularResult = await standalone({
				code: 'a { animation-name: foo; }',
				codeFilename: regularFile,
				config,
				configBasedir: fixturesPath,
			});

			// regular css file doesn't have semantics and animation "foo" is unknown
			expect(regularResult.results).toHaveLength(1);
			expect(regularResult.results[0].warnings).toHaveLength(1);
			expect(regularResult.results[0].warnings[0].rule).toBe('no-unknown-animations');
		});
	});
});
