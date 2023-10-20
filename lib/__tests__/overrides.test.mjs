import { fileURLToPath } from 'node:url';
import path from 'node:path';
import standalone from '../standalone.mjs';

import { jest } from '@jest/globals';

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

		expect(linted.results).toHaveLength(2);
		expect(linted.results[0].source).toBe(inputFiles[0]);
		expect(linted.results[0].warnings.map((w) => w.rule)).toEqual([
			'block-no-empty',
			'color-named',
		]);
		expect(linted.results[1].source).toBe(inputFiles[1]);
		expect(linted.results[1].warnings.map((w) => w.rule)).toEqual([
			'block-no-empty',
			'color-named',
		]);
	});

	it('override with plugins', async () => {
		const linted = await standalone({
			files: [path.join(fixturesPath, 'style.css')],
			config: {
				plugins: ['../plugin-warn-about-foo.cjs'],
				rules: {
					'plugin/warn-about-foo': 'always',
				},
				overrides: [
					{
						files: ['*.css'],
						plugins: ['../plugin-warn-about-bar.cjs'],
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

		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(1);
		expect(linted.results[0].warnings[0].rule).toBe('number-max-precision');
		expect(linted.results[0].warnings[0].text).toBe(
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

		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(1);
		expect(linted.results[0].warnings[0].rule).toBe('number-max-precision');
		expect(linted.results[0].warnings[0].text).toBe(
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

		expect(linted.results).toHaveLength(1);
		expect(linted.results[0].warnings).toHaveLength(1);
		expect(linted.results[0].warnings[0].rule).toBe('number-max-precision');
		expect(linted.results[0].warnings[0].text).toBe(
			'Expected "0.123456789" to be "0.1" (number-max-precision)',
		);
	});

	// https://github.com/stylelint/stylelint/issues/5656
	it('priority to apply overrides (scss): scss extends', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
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

		expect(warn).toHaveBeenCalledWith(expect.stringMatching(/use the "customSyntax" option/));
		warn.mockRestore();
	});

	// https://github.com/stylelint/stylelint/issues/5656
	it('priority to apply overrides (scss): apply rules', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
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

		expect(warn).toHaveBeenCalledWith(expect.stringMatching(/use the "customSyntax" option/));
		warn.mockRestore();
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
