import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
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

	assert.deepEqual(applied, config);
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

		assert.deepEqual(applied, expectedConfig);
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

		assert.deepEqual(applied, expectedConfig);
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

		assert.deepEqual(applied, expectedConfig);
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

		assert.deepEqual(applied, expectedConfig);
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

		assert.deepEqual(applied, expectedConfig);
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

		assert.deepEqual(applied, expectedConfig);
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

		assert.deepEqual(applied, expectedConfig);
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

		assert.deepEqual(applied, expectedConfig);
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

		assert.deepEqual(applied, expectedConfig);
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

		assert.deepEqual(applied, expectedConfig);
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

		assert.deepEqual(applied, expectedConfig);
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

	assert.throws(
		() => {
			applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));
		},
		{
			message:
				'The `overrides` configuration property should be an array, e.g. { "overrides": [{ "files": "*.css", "rules": {} }] }.',
		},
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

	assert.throws(
		() => {
			applyOverrides(config, dirname, path.join(dirname, 'style.module.css'));
		},
		{
			message:
				'Every object in the `overrides` configuration property should have a `files` property with globs, e.g. { "overrides": [{ "files": "*.css", "rules": {} }] }.',
		},
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

	assert.deepEqual(applied, expectedConfig);
});

describe('compileOverrideMatchers', () => {
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

		assert.equal(compiled.length, 1);
		assert.deepEqual(compiled[0].configOverrides, { rules: { 'color-no-hex': true } });
		assert.equal(typeof compiled[0].matches, 'function');
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

		assert.equal(compiled[0].matches(path.join(dirname, 'style.module.css')), true);
		assert.equal(compiled[0].matches(path.join(dirname, 'style.css')), false);
	});

	test('compiled matcher handles dot directories', () => {
		const overrides = [
			{
				files: ['**/*.scss'],
				customSyntax: 'postcss-scss',
			},
		];

		const compiled = compileOverrideMatchers(overrides, dirname);

		assert.equal(compiled[0].matches(path.join(dirname, '.dot-dir', 'style.scss')), true);
	});

	test('throws error when override has no files property', () => {
		const overrides = [
			{
				rules: {
					'color-no-hex': true,
				},
			},
		];

		assert.throws(
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
