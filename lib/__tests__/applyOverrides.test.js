'use strict';

const path = require('path');
const { applyOverrides } = require('../augmentConfig');

test('no overrides', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	const applied = applyOverrides(config, __dirname, path.join(__dirname, 'style.css'));

	expect(applied).toEqual(config);
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
		`"The \`overrides\` configuration property should be an array, e.g. { \\"overrides\\": [{ \\"files\\": \\"*.css\\", \\"rules\\": {} }] }."`,
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
		`"Every object in the \`overrides\` configuration property should have a \`files\` property with globs, e.g. { \\"overrides\\": [{ \\"files\\": \\"*.css\\", \\"rules\\": {} }] }."`,
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
