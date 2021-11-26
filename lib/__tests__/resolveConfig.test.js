'use strict';

const path = require('path');
const pluginWarnAboutFoo = require('./fixtures/plugin-warn-about-foo');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const stylelint = require('..');

describe('resolveConfig', () => {
	it('should resolve to undefined without a path', () => {
		return expect(stylelint.resolveConfig()).resolves.toBeUndefined();
	});

	it('should use getConfigForFile to retrieve the config', async () => {
		const filepath = replaceBackslashes(
			path.join(__dirname, 'fixtures/getConfigForFile/a/b/foo.css'),
		);

		const config = await stylelint.resolveConfig(filepath);

		expect(config).toStrictEqual({
			plugins: [path.join(__dirname, '/fixtures/plugin-warn-about-foo.js')],
			rules: {
				'block-no-empty': [true],
				'plugin/warn-about-foo': ['always'],
			},
			pluginFunctions: {
				'plugin/warn-about-foo': pluginWarnAboutFoo.rule,
			},
		});
	});

	it('should apply config overrides', async () => {
		const filepath = replaceBackslashes(
			path.join(__dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
		);

		const config = await stylelint.resolveConfig(filepath);

		expect(config).toStrictEqual({
			rules: {
				'block-no-empty': [true],
				'color-named': ['never'],
			},
		});
	});

	it('should respect the passed config', async () => {
		const filepath = replaceBackslashes(
			path.join(__dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
		);

		const config = await stylelint.resolveConfig(filepath, {
			config: {
				rules: {
					'color-no-invalid-hex': true,
					'color-no-named': 'always',
				},
			},
		});

		expect(config).toStrictEqual({
			rules: {
				'color-no-invalid-hex': [true],
				'color-no-named': [],
			},
		});
	});

	it('should use the passed config file path', async () => {
		const filepath = replaceBackslashes(
			path.join(__dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
		);

		const config = await stylelint.resolveConfig(filepath, {
			configFile: path.join(__dirname, 'fixtures/getConfigForFile/a/.stylelintrc'),
		});

		expect(config).toStrictEqual({
			pluginFunctions: {
				'plugin/warn-about-foo': expect.any(Function),
			},
			plugins: [expect.stringMatching(/plugin-warn-about-foo/)],
			rules: {
				'block-no-empty': [true],
				'plugin/warn-about-foo': ['always'],
			},
		});
	});

	it('should use the passed config base directory', async () => {
		const filepath = replaceBackslashes(
			path.join(__dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
		);

		const config = await stylelint.resolveConfig(filepath, {
			configBasedir: path.join(__dirname, 'fixtures'),
			config: {
				extends: './config-extending-two',
			},
		});

		expect(config).toStrictEqual({
			rules: {
				'block-no-empty': [true],
				'color-no-invalid-hex': [true],
			},
		});
	});

	it('should use the passed cwd', async () => {
		const filepath = replaceBackslashes(
			path.join(__dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
		);

		const config = await stylelint.resolveConfig(filepath, {
			cwd: path.join(__dirname, 'fixtures'),
			config: {
				extends: './config-extending-two',
			},
		});

		expect(config).toStrictEqual({
			rules: {
				'block-no-empty': [true],
				'color-no-invalid-hex': [true],
			},
		});
	});
});
