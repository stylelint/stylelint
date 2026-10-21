import { describe, it } from 'node:test';

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import standalone from '../standalone.mjs';

const fixturesPath = fileURLToPath(new URL('./fixtures/config-overrides', import.meta.url));

describe('single input file. all overrides are matching', () => {
	it('simple override', async (t) => {
		const inputFiles = [
			path.join(fixturesPath, 'style.css'),
			path.join(fixturesPath, 'testPrintConfig', 'style.css'),
		];
		const linted = await standalone({
			files: inputFiles,
			config: {
				rules: {
					'block-no-empty': true,
				},
				overrides: [
					{
						files: ['*.css'],
						rules: {
							'color-named': 'never',
						},
					},
				],
			},
			configBasedir: fixturesPath,
		});

		t.assert.strictEqual(linted.results.length, 2);
		t.assert.strictEqual(linted.results[0].source, inputFiles[0]);
		t.assert.deepStrictEqual(
			linted.results[0].warnings.map((w) => w.rule),
			['block-no-empty', 'color-named'],
		);
		t.assert.strictEqual(linted.results[1].source, inputFiles[1]);
		t.assert.deepStrictEqual(
			linted.results[1].warnings.map((w) => w.rule),
			['block-no-empty', 'color-named'],
		);
	});

	it('override with plugins', async (t) => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			config: {
				plugins: ['../plugin-warn-about-foo.mjs'],
				rules: {
					'plugin/warn-about-foo': 'always',
				},
				overrides: [
					{
						files: ['*.css'],
						plugins: ['../plugin-warn-about-bar.mjs'],
						rules: {
							'plugin/warn-about-bar': 'always',
						},
					},
				],
			},
			configBasedir: fixturesPath,
		});

		t.assert.strictEqual(linted.results.length, 1);
		t.assert.strictEqual(linted.results[0].warnings.length, 2);
		t.assert.strictEqual(linted.results[0].warnings[0].rule, 'plugin/warn-about-foo');
		t.assert.strictEqual(linted.results[0].warnings[1].rule, 'plugin/warn-about-bar');
	});

	it('override with name property', async (t) => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			config: {
				rules: {
					'block-no-empty': true,
				},
				overrides: [
					{
						files: ['*.css'],
						name: 'Test Override Name',
						rules: {
							'color-named': 'never',
						},
					},
				],
			},
			configBasedir: fixturesPath,
		});

		t.assert.strictEqual(linted.results.length, 1);
		t.assert.strictEqual(linted.results[0].source, path.join(fixturesPath, 'style.css'));
		t.assert.strictEqual(linted.results[0].warnings.length, 2);
		t.assert.strictEqual(linted.results[0].warnings[0].rule, 'block-no-empty');
		t.assert.strictEqual(linted.results[0].warnings[1].rule, 'color-named');
	});

	it('extend with simple overrides', async (t) => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			configFile: path.join(fixturesPath, 'extending-simple-rule.json'),
		});

		t.assert.strictEqual(linted.results.length, 1);
		t.assert.strictEqual(linted.results[0].warnings.length, 2);
		t.assert.strictEqual(linted.results[0].warnings[0].rule, 'block-no-empty');
		t.assert.strictEqual(linted.results[0].warnings[1].rule, 'color-named');
	});

	it('extended and base configs have overrides and plugins', async (t) => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			configFile: path.join(fixturesPath, 'extending-plugin-and-one-rule.json'),
		});

		t.assert.strictEqual(linted.results.length, 1);
		t.assert.strictEqual(linted.results[0].warnings.length, 4);
		t.assert.strictEqual(linted.results[0].warnings[0].rule, 'plugin/warn-about-bar');
		t.assert.strictEqual(linted.results[0].warnings[1].rule, 'plugin/warn-about-foo');
		t.assert.strictEqual(linted.results[0].warnings[2].rule, 'block-no-empty');
		t.assert.strictEqual(linted.results[0].warnings[3].rule, 'color-named');
	});

	it('override with extends', async (t) => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			configFile: path.join(fixturesPath, 'extends-in-overrides.json'),
			configBasedir: fixturesPath,
		});

		t.assert.strictEqual(linted.results.length, 1);
		t.assert.strictEqual(linted.results[0].warnings.length, 2);
		t.assert.strictEqual(linted.results[0].warnings[0].rule, 'block-no-empty');
		t.assert.strictEqual(linted.results[0].warnings[1].rule, 'color-named');
	});

	it('override with extends in overrides', async (t) => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			config: {
				rules: {},
				overrides: [
					{
						files: ['*.css'],
						extends: [path.join(fixturesPath, 'extends-in-overrides.json')],
					},
				],
			},
			configBasedir: fixturesPath,
		});

		t.assert.strictEqual(linted.results.length, 1);
		t.assert.strictEqual(linted.results[0].warnings.length, 2);
		t.assert.strictEqual(linted.results[0].warnings[0].rule, 'block-no-empty');
		t.assert.strictEqual(linted.results[0].warnings[1].rule, 'color-named');
	});

	it('override with extends in config property', async (t) => {
		const { results } = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			config: {
				extends: path.join(fixturesPath, 'extends-in-overrides.json'),
				rules: {},
			},
		});

		t.assert.strictEqual(results.length, 1);
		t.assert.strictEqual(results[0].warnings.length, 2);
		t.assert.strictEqual(results[0].warnings[0].rule, 'block-no-empty');
		t.assert.strictEqual(results[0].warnings[1].rule, 'color-named');
	});

	it('priority to apply overrides: apply overrides extends', async (t) => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'precision.css')],
			config: {
				extends: [path.join(fixturesPath, 'number-max-precision-4.json')],
				overrides: [
					{
						files: ['*.css'],
						extends: [path.join(fixturesPath, 'number-max-precision-8.json')],
					},
				],
			},
			configBasedir: fixturesPath,
		});

		t.assert.strictEqual(linted.results.length, 1);
		t.assert.strictEqual(linted.results[0].warnings.length, 1);
		t.assert.strictEqual(linted.results[0].warnings[0].rule, 'number-max-precision');
		t.assert.strictEqual(
			linted.results[0].warnings[0].text,
			'Expected "0.123456789" to be "0.12345679" (number-max-precision)',
		);
	});

	it('priority to apply overrides: apply overrides rules', async (t) => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'precision.css')],
			config: {
				extends: [path.join(fixturesPath, 'number-max-precision-4.json')],
				rules: {
					'number-max-precision': 1,
				},
				overrides: [
					{
						files: ['*.css'],
						extends: [path.join(fixturesPath, 'number-max-precision-8.json')],
						rules: {
							'number-max-precision': 2,
						},
					},
				],
			},
			configBasedir: fixturesPath,
		});

		t.assert.strictEqual(linted.results.length, 1);
		t.assert.strictEqual(linted.results[0].warnings.length, 1);
		t.assert.strictEqual(linted.results[0].warnings[0].rule, 'number-max-precision');
		t.assert.strictEqual(
			linted.results[0].warnings[0].text,
			'Expected "0.123456789" to be "0.12" (number-max-precision)',
		);
	});

	it('priority to apply overrides: apply rules', async (t) => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'precision.css')],
			config: {
				extends: [path.join(fixturesPath, 'number-max-precision-4.json')],
				rules: {
					'number-max-precision': 1,
				},
				overrides: [
					{
						files: ['*.css'],
						extends: [path.join(fixturesPath, 'number-max-precision-8.json')],
					},
				],
			},
			configBasedir: fixturesPath,
		});

		t.assert.strictEqual(linted.results.length, 1);
		t.assert.strictEqual(linted.results[0].warnings.length, 1);
		t.assert.strictEqual(linted.results[0].warnings[0].rule, 'number-max-precision');
		t.assert.strictEqual(
			linted.results[0].warnings[0].text,
			'Expected "0.123456789" to be "0.1" (number-max-precision)',
		);
	});

	// https://github.com/stylelint/stylelint/issues/5656
	it('priority to apply overrides (scss): scss extends', async (t) => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.scss')],
			config: {
				extends: ['./at-rule-no-unknown.json'],
				overrides: [
					{
						files: '**/*.scss',
						extends: ['./scss.json'],
					},
				],
			},
			configBasedir: fixturesPath,
		});

		t.assert.strictEqual(linted.results.length, 1);
		t.assert.strictEqual(linted.results[0].warnings.length, 0);
	});

	// https://github.com/stylelint/stylelint/issues/5656
	it('priority to apply overrides (scss): apply rules', async (t) => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.scss')],
			config: {
				rules: {
					'at-rule-no-unknown': true,
				},
				overrides: [
					{
						files: '**/*.scss',
						extends: ['./scss.json'],
					},
				],
			},
			configBasedir: fixturesPath,
		});

		t.assert.strictEqual(linted.results.length, 1);
		t.assert.strictEqual(linted.results[0].warnings.length, 1);
		t.assert.strictEqual(linted.results[0].warnings[0].rule, 'at-rule-no-unknown');
	});
});

it('override is not matching', async (t) => {
	const linted = await standalone({
		files: [path.join(fixturesPath, 'style.css')],
		config: {
			rules: {
				'block-no-empty': true,
			},
			overrides: [
				{
					files: ['*.module.css'],
					rules: {
						'color-named': 'never',
					},
				},
			],
		},
		configBasedir: fixturesPath,
	});

	t.assert.strictEqual(linted.results.length, 1);
	t.assert.strictEqual(linted.results[0].warnings.length, 1);
	t.assert.strictEqual(linted.results[0].warnings[0].rule, 'block-no-empty');
});

it('code with a filename. override is matching', async (t) => {
	const linted = await standalone({
		code: '.foo { color: pink; } .bar {}',
		codeFilename: path.join(fixturesPath, 'test.css'),
		config: {
			rules: {
				'block-no-empty': true,
			},
			overrides: [
				{
					files: ['*.css'],
					rules: {
						'color-named': 'never',
					},
				},
			],
		},
		configBasedir: fixturesPath,
	});

	t.assert.strictEqual(linted.results.length, 1);
	t.assert.strictEqual(linted.results[0].warnings.length, 2);
	t.assert.strictEqual(linted.results[0].warnings[0].rule, 'block-no-empty');
	t.assert.strictEqual(linted.results[0].warnings[1].rule, 'color-named');
});

it('code without a filename. overrides is not matching', async (t) => {
	const linted = await standalone({
		code: '.foo { color: pink; } .bar {}',

		config: {
			rules: {
				'block-no-empty': true,
			},
			overrides: [
				{
					files: ['*.css'],
					rules: {
						'color-named': 'never',
					},
				},
			],
		},
		configBasedir: fixturesPath,
	});

	t.assert.strictEqual(linted.results.length, 1);
	t.assert.strictEqual(linted.results[0].warnings.length, 1);
	t.assert.strictEqual(linted.results[0].warnings[0].rule, 'block-no-empty');
});

it('two files', async (t) => {
	const linted = await standalone({
		files: [path.join(fixturesPath, 'style.css'), path.join(fixturesPath, 'style.module.css')],
		config: {
			rules: {
				'block-no-empty': true,
			},
			overrides: [
				{
					files: ['style.css'],
					rules: {
						'color-named': 'never',
					},
				},
				{
					files: ['*.module.css'],
					rules: {
						'block-no-empty': null,
						'property-disallowed-list': ['background'],
					},
				},
			],
		},
		configBasedir: fixturesPath,
	});

	t.assert.strictEqual(linted.results.length, 2);
	t.assert.strictEqual(linted.results[0].warnings.length, 2);
	t.assert.strictEqual(linted.results[0].warnings[0].rule, 'block-no-empty');
	t.assert.strictEqual(linted.results[0].warnings[1].rule, 'color-named');

	t.assert.strictEqual(linted.results[1].warnings.length, 1);
	t.assert.strictEqual(linted.results[1].warnings[0].rule, 'property-disallowed-list');
});

it('preserves ruleMetadata when an earlier explicit file does not match any overrides', async (t) => {
	const config = {
		rules: {},
		overrides: [
			{
				files: ['style.css'],
				rules: {
					'block-no-empty': true,
					'color-named': 'never',
				},
			},
		],
	};
	const expected = await standalone({
		files: [path.join(fixturesPath, 'style.css')],
		config,
		configBasedir: fixturesPath,
	});
	const actual = await standalone({
		files: [path.join(fixturesPath, 'precision.css'), path.join(fixturesPath, 'style.css')],
		config,
		configBasedir: fixturesPath,
	});

	t.assert.deepStrictEqual(expected.ruleMetadata, actual.ruleMetadata);
	t.assert.deepStrictEqual(Object.keys(actual.ruleMetadata).sort(), [
		'block-no-empty',
		'color-named',
	]);
});

it('negation glob pattern', async (t) => {
	const { results } = await standalone({
		files: [path.join(fixturesPath, 'style.css'), path.join(fixturesPath, 'style.module.css')],
		config: {
			rules: { 'block-no-empty': null },
			overrides: [
				{
					files: ['!(**/style.css)'],
					rules: { 'block-no-empty': true },
				},
			],
		},
	});

	t.assert.strictEqual(results.length, 2);
	t.assert.ok(results[0].source.includes('style.css'));
	t.assert.deepStrictEqual(results[0].warnings, []);
	t.assert.ok(results[1].source.includes('style.module.css'));
	t.assert.strictEqual(results[1].warnings[0].rule, 'block-no-empty');
});
