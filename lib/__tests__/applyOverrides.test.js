'use strict';

const path = require('path');
const { applyOverrides } = require('../augmentConfig');

describe('no overrides', () => {
	test('rules only', () => {
		const config = {
			rules: {
				'block-no-empty': true,
			},
		};

		const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.css'));

		expect(applied).toEqual(config);
	});

	test('duplicate plugins', () => {
		const config = {
			plugins: ['stylelint-plugin', 'stylelint-plugin'],
		};

		const expectedConfig = {
			plugins: ['stylelint-plugin'],
		};

		const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.css'));

		expect(applied).toEqual(expectedConfig);
	});

	test('duplicate extends', () => {
		const config = {
			extends: ['stylelint-config', 'stylelint-config'],
		};

		const expectedConfig = {
			extends: ['stylelint-config'],
		};

		const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.css'));

		expect(applied).toEqual(expectedConfig);
	});
});

describe('single matching override', () => {
	test('simple override', () => {
		const config = {
			rules: {
				'block-no-empty': true,
			},
			overrides: [
				{
					files: ['*.module.css'],
					rules: {
						'color-no-hex': true,
					},
				},
			],
		};

		const expectedConfig = {
			rules: {
				'block-no-empty': true,
				'color-no-hex': true,
			},
		};

		const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.module.css'));

		expect(applied).toEqual(expectedConfig);
	});

	test('simple override, files is a string', () => {
		const config = {
			rules: {
				'block-no-empty': true,
			},
			overrides: [
				{
					files: '*.module.css',
					rules: {
						'color-no-hex': true,
					},
				},
			],
		};

		const expectedConfig = {
			rules: {
				'block-no-empty': true,
				'color-no-hex': true,
			},
		};

		const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.module.css'));

		expect(applied).toEqual(expectedConfig);
	});

	test('with plugins', () => {
		const config = {
			plugins: ['stylelint-plugin'],
			rules: {
				'block-no-empty': true,
			},
			overrides: [
				{
					files: ['*.module.css'],
					plugins: ['stylelint-plugin2'],
					rules: {
						'color-no-hex': true,
					},
				},
			],
		};

		const expectedConfig = {
			plugins: ['stylelint-plugin', 'stylelint-plugin2'],
			rules: {
				'block-no-empty': true,
				'color-no-hex': true,
			},
		};

		const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.module.css'));

		expect(applied).toEqual(expectedConfig);
	});

	test('override with dot dir', () => {
		const config = {
			overrides: [
				{
					files: ['**/*.scss'],
					customSyntax: 'postcss-scss',
				},
			],
		};

		const expectedConfig = {
			customSyntax: 'postcss-scss',
		};

		const applied = applyOverrides(
			config,
			__dirname,
			path.join(__dirname, '.dot-dir', 'style.scss'),
		);

		expect(applied).toEqual(expectedConfig);
	});
});

describe('two matching overrides', () => {
	test('simple override', () => {
		const config = {
			rules: {
				'block-no-empty': true,
				'unit-disallowed-list': ['px'],
			},
			overrides: [
				{
					files: ['*.module.css'],
					rules: {
						'color-no-hex': true,
					},
				},
				{
					files: ['*.css'],
					rules: {
						'block-no-empty': null,
					},
				},
			],
		};

		const expectedConfig = {
			rules: {
				'block-no-empty': null,
				'unit-disallowed-list': ['px'],
				'color-no-hex': true,
			},
		};

		const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.module.css'));

		expect(applied).toEqual(expectedConfig);
	});

	test('with plugins', () => {
		const config = {
			plugins: ['stylelint-plugin'],
			rules: {
				'block-no-empty': true,
				'unit-disallowed-list': ['px'],
			},
			overrides: [
				{
					files: ['*.module.css'],
					plugins: ['stylelint-plugin2'],
					rules: {
						'color-no-hex': true,
					},
				},
				{
					files: ['*.css'],
					plugins: ['stylelint-plugin3'],
					rules: {
						'block-no-empty': null,
					},
				},
			],
		};

		const expectedConfig = {
			plugins: ['stylelint-plugin', 'stylelint-plugin2', 'stylelint-plugin3'],
			rules: {
				'block-no-empty': null,
				'unit-disallowed-list': ['px'],
				'color-no-hex': true,
			},
		};

		const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.module.css'));

		expect(applied).toEqual(expectedConfig);
	});

	test('with duplicate plugins', () => {
		const config = {
			plugins: ['stylelint-plugin', 'stylelint-plugin'],
			rules: {
				'block-no-empty': true,
				'unit-disallowed-list': ['px'],
			},
			overrides: [
				{
					files: ['*.module.css'],
					rules: {
						'color-no-hex': true,
					},
				},
				{
					files: ['*.css'],
					rules: {
						'block-no-empty': null,
					},
				},
			],
		};

		const expectedConfig = {
			plugins: ['stylelint-plugin'],
			rules: {
				'block-no-empty': null,
				'unit-disallowed-list': ['px'],
				'color-no-hex': true,
			},
		};

		const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.module.css'));

		expect(applied).toEqual(expectedConfig);
	});

	test('with extends', () => {
		const config = {
			extends: ['stylelint-config1'],
			rules: {
				'block-no-empty': true,
				'unit-disallowed-list': ['px'],
			},
			overrides: [
				{
					files: ['*.module.css'],
					extends: ['stylelint-config2'],
					rules: {
						'color-no-hex': true,
					},
				},
				{
					files: ['*.css'],
					extends: ['stylelint-config3'],
					rules: {
						'block-no-empty': null,
					},
				},
			],
		};

		const expectedConfig = {
			extends: ['stylelint-config1', 'stylelint-config2', 'stylelint-config3'],
			rules: {
				'block-no-empty': null,
				'unit-disallowed-list': ['px'],
				'color-no-hex': true,
			},
		};

		const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.module.css'));

		expect(applied).toEqual(expectedConfig);
	});
});

describe('no matching overrides', () => {
	test('simple override', () => {
		const config = {
			rules: {
				'block-no-empty': true,
			},
			overrides: [
				{
					files: ['*.no-module.css'],
					rules: {
						'color-no-hex': true,
					},
				},
			],
		};

		const expectedConfig = {
			rules: {
				'block-no-empty': true,
			},
		};

		const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.module.css'));

		expect(applied).toEqual(expectedConfig);
	});

	test('with plugins', () => {
		const config = {
			plugins: ['stylelint-plugin'],
			rules: {
				'block-no-empty': true,
			},
			overrides: [
				{
					files: ['*.no-module.css'],
					plugins: ['stylelint-plugin2'],
					rules: {
						'color-no-hex': true,
					},
				},
			],
		};

		const expectedConfig = {
			plugins: ['stylelint-plugin'],
			rules: {
				'block-no-empty': true,
			},
		};

		const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.module.css'));

		expect(applied).toEqual(expectedConfig);
	});
});

describe('duplicate overrides', () => {
	test('with two matches', () => {
		const override = {
			files: ['*.css'],
			rules: {
				'block-no-empty': true,
			},
		};

		const config = {
			overrides: [
				{
					files: ['*.module.css'],
					overrides: [override],
				},
				{
					files: ['*.css'],
					overrides: [override],
				},
			],
		};

		const expectedConfig = {
			overrides: [override],
		};

		const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.module.css'));

		expect(applied).toEqual(expectedConfig);
	});

	test('with ordered overrides', () => {
		const override1 = {
			files: ['*.css'],
			rules: {
				'block-no-empty': true,
			},
		};

		const override2 = {
			files: ['*.module.css'],
			rules: {
				'block-no-empty': null,
			},
		};

		const config = {
			overrides: [
				{
					files: ['*.module.css'],
					overrides: [override1, override2],
				},
				{
					files: ['*.css'],
					overrides: [override2, override1],
				},
			],
		};

		const expectedConfig = {
			overrides: [override2, override1],
		};

		const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.module.css'));

		expect(applied).toEqual(expectedConfig);
	});
});

test('overrides is not an array', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
		overrides: {
			files: ['*.module.css'],
			rules: {
				'color-no-hex': true,
			},
		},
	};

	expect(() => {
		applyOverrides(config, __dirname, path.join(__dirname, 'style.module.css'));
	}).toThrowErrorMatchingInlineSnapshot(
		`"The \`overrides\` configuration property should be an array, e.g. { "overrides": [{ "files": "*.css", "rules": {} }] }."`,
	);
});

test('`files` is missing', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
		overrides: [
			{
				rules: {
					'color-no-hex': true,
				},
			},
		],
	};

	expect(() => {
		applyOverrides(config, __dirname, path.join(__dirname, 'style.module.css'));
	}).toThrowErrorMatchingInlineSnapshot(
		`"Every object in the \`overrides\` configuration property should have a \`files\` property with globs, e.g. { "overrides": [{ "files": "*.css", "rules": {} }] }."`,
	);
});

test('if glob is absolute path', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
		overrides: [
			{
				files: [path.join(__dirname, 'style.css')],
				rules: {
					'color-no-hex': true,
				},
			},
		],
	};

	const expectedConfig = {
		rules: {
			'block-no-empty': true,
			'color-no-hex': true,
		},
	};

	const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.css'));

	expect(applied).toEqual(expectedConfig);
});
