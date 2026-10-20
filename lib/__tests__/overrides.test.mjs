import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import standalone from '../standalone.mjs';

const fixturesPath = fileURLToPath(new URL('./fixtures/config-overrides', import.meta.url));

describe('single input file. all overrides are matching', () => {
	it('simple override', async () => {
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

		assert.equal(linted.results.length, 2);
		assert.equal(linted.results[0].source, inputFiles[0]);
		assert.deepEqual(
			linted.results[0].warnings.map((w) => w.rule),
			['block-no-empty', 'color-named'],
		);
		assert.equal(linted.results[1].source, inputFiles[1]);
		assert.deepEqual(
			linted.results[1].warnings.map((w) => w.rule),
			['block-no-empty', 'color-named'],
		);
	});

	it('override with plugins', async () => {
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

		assert.equal(linted.results.length, 1);
		assert.equal(linted.results[0].warnings.length, 2);
		assert.equal(linted.results[0].warnings[0].rule, 'plugin/warn-about-foo');
		assert.equal(linted.results[0].warnings[1].rule, 'plugin/warn-about-bar');
	});

	it('override with name property', async () => {
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

		assert.equal(linted.results.length, 1);
		assert.equal(linted.results[0].source, path.join(fixturesPath, 'style.css'));
		assert.equal(linted.results[0].warnings.length, 2);
		assert.equal(linted.results[0].warnings[0].rule, 'block-no-empty');
		assert.equal(linted.results[0].warnings[1].rule, 'color-named');
	});

	it('extend with simple overrides', async () => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			configFile: path.join(fixturesPath, 'extending-simple-rule.json'),
		});

		assert.equal(linted.results.length, 1);
		assert.equal(linted.results[0].warnings.length, 2);
		assert.equal(linted.results[0].warnings[0].rule, 'block-no-empty');
		assert.equal(linted.results[0].warnings[1].rule, 'color-named');
	});

	it('extended and base configs have overrides and plugins', async () => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			configFile: path.join(fixturesPath, 'extending-plugin-and-one-rule.json'),
		});

		assert.equal(linted.results.length, 1);
		assert.equal(linted.results[0].warnings.length, 4);
		assert.equal(linted.results[0].warnings[0].rule, 'plugin/warn-about-bar');
		assert.equal(linted.results[0].warnings[1].rule, 'plugin/warn-about-foo');
		assert.equal(linted.results[0].warnings[2].rule, 'block-no-empty');
		assert.equal(linted.results[0].warnings[3].rule, 'color-named');
	});

	it('override with extends', async () => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			configFile: path.join(fixturesPath, 'extends-in-overrides.json'),
			configBasedir: fixturesPath,
		});

		assert.equal(linted.results.length, 1);
		assert.equal(linted.results[0].warnings.length, 2);
		assert.equal(linted.results[0].warnings[0].rule, 'block-no-empty');
		assert.equal(linted.results[0].warnings[1].rule, 'color-named');
	});

	it('override with extends in overrides', async () => {
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

		assert.equal(linted.results.length, 1);
		assert.equal(linted.results[0].warnings.length, 2);
		assert.equal(linted.results[0].warnings[0].rule, 'block-no-empty');
		assert.equal(linted.results[0].warnings[1].rule, 'color-named');
	});

	it('override with extends in config property', async () => {
		const { results } = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			config: {
				extends: path.join(fixturesPath, 'extends-in-overrides.json'),
				rules: {},
			},
		});

		assert.equal(results.length, 1);
		assert.equal(results[0].warnings.length, 2);
		assert.equal(results[0].warnings[0].rule, 'block-no-empty');
		assert.equal(results[0].warnings[1].rule, 'color-named');
	});

	it('priority to apply overrides: apply overrides extends', async () => {
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

		assert.equal(linted.results.length, 1);
		assert.equal(linted.results[0].warnings.length, 1);
		assert.equal(linted.results[0].warnings[0].rule, 'number-max-precision');
		assert.equal(
			linted.results[0].warnings[0].text,
			'Expected "0.123456789" to be "0.12345679" (number-max-precision)',
		);
	});

	it('priority to apply overrides: apply overrides rules', async () => {
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

		assert.equal(linted.results.length, 1);
		assert.equal(linted.results[0].warnings.length, 1);
		assert.equal(linted.results[0].warnings[0].rule, 'number-max-precision');
		assert.equal(
			linted.results[0].warnings[0].text,
			'Expected "0.123456789" to be "0.12" (number-max-precision)',
		);
	});

	it('priority to apply overrides: apply rules', async () => {
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

		assert.equal(linted.results.length, 1);
		assert.equal(linted.results[0].warnings.length, 1);
		assert.equal(linted.results[0].warnings[0].rule, 'number-max-precision');
		assert.equal(
			linted.results[0].warnings[0].text,
			'Expected "0.123456789" to be "0.1" (number-max-precision)',
		);
	});

	// https://github.com/stylelint/stylelint/issues/5656
	it('priority to apply overrides (scss): scss extends', async () => {
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

		assert.equal(linted.results.length, 1);
		assert.equal(linted.results[0].warnings.length, 0);
	});

	// https://github.com/stylelint/stylelint/issues/5656
	it('priority to apply overrides (scss): apply rules', async () => {
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

		assert.equal(linted.results.length, 1);
		assert.equal(linted.results[0].warnings.length, 1);
		assert.equal(linted.results[0].warnings[0].rule, 'at-rule-no-unknown');
	});
});

it('override is not matching', async () => {
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

	assert.equal(linted.results.length, 1);
	assert.equal(linted.results[0].warnings.length, 1);
	assert.equal(linted.results[0].warnings[0].rule, 'block-no-empty');
});

it('code with a filename. override is matching', async () => {
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

	assert.equal(linted.results.length, 1);
	assert.equal(linted.results[0].warnings.length, 2);
	assert.equal(linted.results[0].warnings[0].rule, 'block-no-empty');
	assert.equal(linted.results[0].warnings[1].rule, 'color-named');
});

it('code without a filename. overrides is not matching', async () => {
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

	assert.equal(linted.results.length, 1);
	assert.equal(linted.results[0].warnings.length, 1);
	assert.equal(linted.results[0].warnings[0].rule, 'block-no-empty');
});

it('two files', async () => {
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

	assert.equal(linted.results.length, 2);
	assert.equal(linted.results[0].warnings.length, 2);
	assert.equal(linted.results[0].warnings[0].rule, 'block-no-empty');
	assert.equal(linted.results[0].warnings[1].rule, 'color-named');

	assert.equal(linted.results[1].warnings.length, 1);
	assert.equal(linted.results[1].warnings[0].rule, 'property-disallowed-list');
});

it('preserves ruleMetadata when an earlier explicit file does not match any overrides', async () => {
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

	assert.deepEqual(expected.ruleMetadata, actual.ruleMetadata);
	assert.deepEqual(Object.keys(actual.ruleMetadata).sort(), ['block-no-empty', 'color-named']);
});

it('negation glob pattern', async () => {
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

	assert.equal(results.length, 2);
	assert.ok(results[0].source.includes('style.css'));
	assert.deepEqual(results[0].warnings, []);
	assert.ok(results[1].source.includes('style.module.css'));
	assert.equal(results[1].warnings[0].rule, 'block-no-empty');
});
