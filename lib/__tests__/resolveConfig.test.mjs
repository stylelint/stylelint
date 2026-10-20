import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import path from 'node:path';
import pluginWarnAboutFoo from './fixtures/plugin-warn-about-foo.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import stylelint from '../index.mjs';

const dirname = import.meta.dirname;

describe('resolveConfig', () => {
	it('should resolve to undefined without a path', async () => {
		assert.equal(await stylelint.resolveConfig(), undefined);
	});

	it('should use getConfigForFile to retrieve the config', async () => {
		const filepath = replaceBackslashes(
			path.join(dirname, 'fixtures/getConfigForFile/a/b/foo.css'),
		);

		const config = await stylelint.resolveConfig(filepath);

		assert.deepEqual(config, {
			plugins: [path.join(dirname, '/fixtures/plugin-warn-about-foo.mjs')],
			rules: {
				'block-no-empty': [true],
				'plugin/warn-about-foo': ['always'],
			},
			_pluginFunctions: {
				'plugin/warn-about-foo': pluginWarnAboutFoo.rule,
			},
		});
	});

	it('should apply config overrides', async () => {
		const filepath = replaceBackslashes(
			path.join(dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
		);

		const config = await stylelint.resolveConfig(filepath);

		assert.deepEqual(config, {
			rules: {
				'block-no-empty': [true],
				'color-named': ['never'],
			},
		});
	});

	it('should respect the passed config', async () => {
		const filepath = replaceBackslashes(
			path.join(dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
		);

		const config = await stylelint.resolveConfig(filepath, {
			config: {
				rules: {
					'color-no-invalid-hex': true,
					'color-no-named': 'always',
				},
			},
		});

		assert.deepEqual(config, {
			rules: {
				'color-no-invalid-hex': [true],
				'color-no-named': [],
			},
		});
	});

	it('should use the passed config file path', async () => {
		const filepath = replaceBackslashes(
			path.join(dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
		);

		const config = await stylelint.resolveConfig(filepath, {
			configFile: path.join(dirname, 'fixtures/getConfigForFile/a/.stylelintrc'),
		});

		const { _pluginFunctions, plugins, ...rest } = config;

		assert.deepEqual(Object.keys(_pluginFunctions), ['plugin/warn-about-foo']);
		assert.equal(typeof _pluginFunctions['plugin/warn-about-foo'], 'function');
		assert.equal(plugins.length, 1);
		assert.match(plugins[0], /plugin-warn-about-foo/);
		assert.deepEqual(rest, {
			rules: {
				'block-no-empty': [true],
				'plugin/warn-about-foo': ['always'],
			},
		});
	});

	it('should use the passed config base directory', async () => {
		const filepath = replaceBackslashes(
			path.join(dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
		);

		const config = await stylelint.resolveConfig(filepath, {
			configBasedir: path.join(dirname, 'fixtures'),
			config: {
				extends: './config-extending-two.json',
			},
		});

		assert.deepEqual(config, {
			rules: {
				'block-no-empty': [true],
				'color-no-invalid-hex': [true],
			},
		});
	});

	it('should use the passed cwd', async () => {
		const filepath = replaceBackslashes(
			path.join(dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
		);

		const config = await stylelint.resolveConfig(filepath, {
			cwd: path.join(dirname, 'fixtures'),
			config: {
				extends: './config-extending-two.json',
			},
		});

		assert.deepEqual(config, {
			rules: {
				'block-no-empty': [true],
				'color-no-invalid-hex': [true],
			},
		});
	});
});
