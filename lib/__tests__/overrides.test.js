'use strict';

const path = require('path');
const standalone = require('../standalone');

const fixturesPath = path.join(__dirname, 'fixtures', 'config-overrides');

describe('single input file. all overrides are matching', () => {
	it('simple override', async () => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
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

		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(2);
		expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
		expect(linted.results[0].warnings[1].rule).toBe('color-named');
	});

	it('override with plugins', async () => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			config: {
				plugins: ['../plugin-warn-about-foo'],
				rules: {
					'plugin/warn-about-foo': 'always',
				},
				overrides: [
					{
						files: ['*.css'],
						plugins: ['../plugin-warn-about-bar'],
						rules: {
							'plugin/warn-about-bar': 'always',
						},
					},
				],
			},
			configBasedir: fixturesPath,
		});

		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(2);
		expect(linted.results[0].warnings[0].rule).toBe('plugin/warn-about-foo');
		expect(linted.results[0].warnings[1].rule).toBe('plugin/warn-about-bar');
	});

	it('extend with simple overrides', async () => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			configFile: path.join(fixturesPath, 'extending-simple-rule.json'),
		});

		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(2);
		expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
		expect(linted.results[0].warnings[1].rule).toBe('color-named');
	});

	it('extended and base configs have overrides and plugins', async () => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			configFile: path.join(fixturesPath, 'extending-plugin-and-one-rule.json'),
		});

		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(4);
		expect(linted.results[0].warnings[0].rule).toBe('plugin/warn-about-bar');
		expect(linted.results[0].warnings[1].rule).toBe('plugin/warn-about-foo');
		expect(linted.results[0].warnings[2].rule).toBe('block-no-empty');
		expect(linted.results[0].warnings[3].rule).toBe('color-named');
	});

	it('override with extends', async () => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			configFile: path.join(fixturesPath, 'extends-in-overrides.json'),
			configBasedir: fixturesPath,
		});

		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(2);
		expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
		expect(linted.results[0].warnings[1].rule).toBe('color-named');
	});

	it('override with extends in overrides', async () => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			config: {
				overrides: [
					{
						files: ['*.css'],
						extends: [path.join(fixturesPath, 'extends-in-overrides.json')],
					},
				],
			},
			configBasedir: fixturesPath,
		});

		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(2);
		expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
		expect(linted.results[0].warnings[1].rule).toBe('color-named');
	});

	it('priority to apply overrides: apply overrides extends', async () => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			config: {
				extends: [path.join(fixturesPath, 'indent4.json')],
				overrides: [
					{
						files: ['*.css'],
						extends: [path.join(fixturesPath, 'indent8.json')],
					},
				],
			},
			configBasedir: fixturesPath,
		});

		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(1);
		expect(linted.results[0].warnings[0].rule).toBe('indentation');
		expect(linted.results[0].warnings[0].text).toBe(
			'Expected indentation of 8 spaces (indentation)',
		);
	});

	it('priority to apply overrides: apply overrides rules', async () => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			config: {
				extends: [path.join(fixturesPath, 'indent4.json')],
				rules: {
					indentation: 3,
				},
				overrides: [
					{
						files: ['*.css'],
						extends: [path.join(fixturesPath, 'indent8.json')],
						rules: {
							indentation: 'tab',
						},
					},
				],
			},
			configBasedir: fixturesPath,
		});

		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(1);
		expect(linted.results[0].warnings[0].rule).toBe('indentation');
		expect(linted.results[0].warnings[0].text).toBe('Expected indentation of 1 tab (indentation)');
	});

	it('priority to apply overrides: apply rules', async () => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			config: {
				extends: [path.join(fixturesPath, 'indent4.json')],
				rules: {
					indentation: 'tab',
				},
				overrides: [
					{
						files: ['*.css'],
						extends: [path.join(fixturesPath, 'indent8.json')],
					},
				],
			},
			configBasedir: fixturesPath,
		});

		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(1);
		expect(linted.results[0].warnings[0].rule).toBe('indentation');
		expect(linted.results[0].warnings[0].text).toBe('Expected indentation of 1 tab (indentation)');
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

		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(0);
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

		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(1);
		expect(linted.results[0].warnings[0].rule).toBe('at-rule-no-unknown');
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

	expect(linted.results).toHaveLength(1);
	expect(linted.results[0].warnings).toHaveLength(1);
	expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
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

	expect(linted.results).toHaveLength(1);
	expect(linted.results[0].warnings).toHaveLength(2);
	expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
	expect(linted.results[0].warnings[1].rule).toBe('color-named');
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

	expect(linted.results).toHaveLength(1);
	expect(linted.results[0].warnings).toHaveLength(1);
	expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
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

	expect(linted.results).toHaveLength(2);
	expect(linted.results[0].warnings).toHaveLength(2);
	expect(linted.results[0].warnings[0].rule).toBe('block-no-empty');
	expect(linted.results[0].warnings[1].rule).toBe('color-named');

	expect(linted.results[1].warnings).toHaveLength(1);
	expect(linted.results[1].warnings[0].rule).toBe('property-disallowed-list');
});
