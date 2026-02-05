import path from 'node:path';

import { applyOverrides, compileOverrideMatchers } from '../augmentConfig.mjs';

const dirname = import.meta.dirname;

test('no overrides', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	const applied = applyOverrides(config, dirname, path.join(dirname, 'style.css'));

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

		const applied = applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));

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

		const applied = applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));

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

		const applied = applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));

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

		const applied = applyOverrides(config, dirname, path.join(dirname, '.dot-dir', 'style.scss'));

		expect(applied).toEqual(expectedConfig);
	});

	test('with processors', () => {
		const config = {
			processors: ['stylelint-processor1'],
			rules: {
				'block-no-empty': true,
			},
			overrides: [
				{
					files: ['*.module.css'],
					processors: ['stylelint-processor2'],
					rules: {
						'color-no-hex': true,
					},
				},
			],
		};

		const expectedConfig = {
			processors: ['stylelint-processor1', 'stylelint-processor2'],
			rules: {
				'block-no-empty': true,
				'color-no-hex': true,
			},
		};

		const applied = applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));

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

		const applied = applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));

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

		const applied = applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));

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

		const applied = applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));

		expect(applied).toEqual(expectedConfig);
	});

	test('with ordered extends', () => {
		const config = {
			extends: ['stylelint-config1'],
			overrides: [
				{
					files: ['*.module.css'],
					extends: ['stylelint-config2', 'stylelint-config1'],
				},
				{
					files: ['*.css'],
					extends: ['stylelint-config3'],
				},
			],
		};

		const expectedConfig = {
			extends: ['stylelint-config2', 'stylelint-config1', 'stylelint-config3'],
		};

		const applied = applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));

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

		const applied = applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));

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

		const applied = applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));

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
		applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));
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
		applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));
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
				files: [path.join(dirname, 'style.css')],
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

	const applied = applyOverrides(config, dirname, path.join(dirname, 'style.css'));

	expect(applied).toEqual(expectedConfig);
});

describe('compileOverrideMatchers', () => {
	test('returns empty array for undefined overrides', () => {
		const compiled = compileOverrideMatchers(undefined, dirname);

		expect(compiled).toEqual([]);
	});

	test('returns empty array when overrides is not an array', () => {
		const compiled = compileOverrideMatchers({}, dirname);

		expect(compiled).toEqual([]);
	});

	test('compiles single override', () => {
		const overrides = [
			{
				files: ['*.module.css'],
				rules: {
					'color-no-hex': true,
				},
			},
		];

		const compiled = compileOverrideMatchers(overrides, dirname);

		expect(compiled).toHaveLength(1);
		expect(compiled[0].configOverrides).toEqual({ rules: { 'color-no-hex': true } });
		expect(typeof compiled[0].matches).toBe('function');
	});

	test('compiled matcher matches correct files', () => {
		const overrides = [
			{
				files: ['*.module.css'],
				rules: {
					'color-no-hex': true,
				},
			},
		];

		const compiled = compileOverrideMatchers(overrides, dirname);

		expect(compiled[0].matches(path.join(dirname, 'style.module.css'))).toBe(true);
		expect(compiled[0].matches(path.join(dirname, 'style.css'))).toBe(false);
	});

	test('compiled matcher handles dot directories', () => {
		const overrides = [
			{
				files: ['**/*.scss'],
				customSyntax: 'postcss-scss',
			},
		];

		const compiled = compileOverrideMatchers(overrides, dirname);

		expect(compiled[0].matches(path.join(dirname, '.dot-dir', 'style.scss'))).toBe(true);
	});

	test('throws error when override has no files property', () => {
		const overrides = [
			{
				rules: {
					'color-no-hex': true,
				},
			},
		];

		expect(() => {
			compileOverrideMatchers(overrides, dirname);
		}).toThrowErrorMatchingInlineSnapshot(
			`"Every object in the \`overrides\` configuration property should have a \`files\` property with globs, e.g. { "overrides": [{ "files": "*.css", "rules": {} }] }."`,
		);
	});
});
