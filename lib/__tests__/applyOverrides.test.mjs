import { describe, test } from 'node:test';
import path from 'node:path';

import { applyOverrides, compileOverrideMatchers } from '../augmentConfig.mjs';

const dirname = import.meta.dirname;

test('no overrides', (t) => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
	};

	const applied = applyOverrides(config, dirname, path.join(dirname, 'style.css'));

	t.assert.deepStrictEqual(applied, config);
});

describe('single matching override', () => {
	test('simple override', (t) => {
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

		t.assert.deepStrictEqual(applied, expectedConfig);
	});

	test('simple override, files is a string', (t) => {
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

		t.assert.deepStrictEqual(applied, expectedConfig);
	});

	test('with plugins', (t) => {
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

		t.assert.deepStrictEqual(applied, expectedConfig);
	});

	test('override with dot dir', (t) => {
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

		t.assert.deepStrictEqual(applied, expectedConfig);
	});

	test('with processors', (t) => {
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

		t.assert.deepStrictEqual(applied, expectedConfig);
	});
});

describe('two matching overrides', () => {
	test('simple override', (t) => {
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

		t.assert.deepStrictEqual(applied, expectedConfig);
	});

	test('with plugins', (t) => {
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

		t.assert.deepStrictEqual(applied, expectedConfig);
	});

	test('with extends', (t) => {
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

		t.assert.deepStrictEqual(applied, expectedConfig);
	});

	test('with ordered extends', (t) => {
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

		t.assert.deepStrictEqual(applied, expectedConfig);
	});
});

describe('no matching overrides', () => {
	test('simple override', (t) => {
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

		t.assert.deepStrictEqual(applied, expectedConfig);
	});

	test('with plugins', (t) => {
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

		t.assert.deepStrictEqual(applied, expectedConfig);
	});
});

test('overrides is not an array', (t) => {
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

	t.assert.throws(
		() => {
			applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));
		},
		{
			message:
				'The `overrides` configuration property should be an array, e.g. { "overrides": [{ "files": "*.css", "rules": {} }] }.',
		},
	);
});

test('`files` is missing', (t) => {
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

	t.assert.throws(
		() => {
			applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));
		},
		{
			message:
				'Every object in the `overrides` configuration property should have a `files` property with globs, e.g. { "overrides": [{ "files": "*.css", "rules": {} }] }.',
		},
	);
});

test('if glob is absolute path', (t) => {
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

	t.assert.deepStrictEqual(applied, expectedConfig);
});

describe('compileOverrideMatchers', () => {
	test('compiles single override', (t) => {
		const overrides = [
			{
				files: ['*.module.css'],
				rules: {
					'color-no-hex': true,
				},
			},
		];

		const compiled = compileOverrideMatchers(overrides, dirname);

		t.assert.strictEqual(compiled.length, 1);
		t.assert.deepStrictEqual(compiled[0].configOverrides, { rules: { 'color-no-hex': true } });
		t.assert.strictEqual(typeof compiled[0].matches, 'function');
	});

	test('compiled matcher matches correct files', (t) => {
		const overrides = [
			{
				files: ['*.module.css'],
				rules: {
					'color-no-hex': true,
				},
			},
		];

		const compiled = compileOverrideMatchers(overrides, dirname);

		t.assert.strictEqual(compiled[0].matches(path.join(dirname, 'style.module.css')), true);
		t.assert.strictEqual(compiled[0].matches(path.join(dirname, 'style.css')), false);
	});

	test('compiled matcher handles dot directories', (t) => {
		const overrides = [
			{
				files: ['**/*.scss'],
				customSyntax: 'postcss-scss',
			},
		];

		const compiled = compileOverrideMatchers(overrides, dirname);

		t.assert.strictEqual(compiled[0].matches(path.join(dirname, '.dot-dir', 'style.scss')), true);
	});

	test('throws error when override has no files property', (t) => {
		const overrides = [
			{
				rules: {
					'color-no-hex': true,
				},
			},
		];

		t.assert.throws(
			() => {
				compileOverrideMatchers(overrides, dirname);
			},
			{
				message:
					'Every object in the `overrides` configuration property should have a `files` property with globs, e.g. { "overrides": [{ "files": "*.css", "rules": {} }] }.',
			},
		);
	});
});
