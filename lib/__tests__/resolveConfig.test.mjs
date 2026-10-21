import { describe, it } from 'node:test';

import path from 'node:path';
import pluginWarnAboutFoo from './fixtures/plugin-warn-about-foo.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import stylelint from '../index.mjs';

const dirname = import.meta.dirname;

describe('resolveConfig', () => {
	it('should resolve to undefined without a path', async (t) => {
		t.assert.strictEqual(await stylelint.resolveConfig(), undefined);
	});

	it('should use getConfigForFile to retrieve the config', async (t) => {
		const filepath = replaceBackslashes(
			path.join(dirname, 'fixtures/getConfigForFile/a/b/foo.css'),
		);

		const config = await stylelint.resolveConfig(filepath);

		t.assert.deepStrictEqual(config, {
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

	it('should apply config overrides', async (t) => {
		const filepath = replaceBackslashes(
			path.join(dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
		);

		const config = await stylelint.resolveConfig(filepath);

		t.assert.deepStrictEqual(config, {
			rules: {
				'block-no-empty': [true],
				'color-named': ['never'],
			},
		});
	});

	it('should respect the passed config', async (t) => {
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

		t.assert.deepStrictEqual(config, {
			rules: {
				'color-no-invalid-hex': [true],
				'color-no-named': [],
			},
		});
	});

	it('should use the passed config file path', async (t) => {
		const filepath = replaceBackslashes(
			path.join(dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
		);

		const config = await stylelint.resolveConfig(filepath, {
			configFile: path.join(dirname, 'fixtures/getConfigForFile/a/.stylelintrc'),
		});

		const { _pluginFunctions, plugins, ...rest } = config;

		t.assert.deepStrictEqual(Object.keys(_pluginFunctions), ['plugin/warn-about-foo']);
		t.assert.strictEqual(typeof _pluginFunctions['plugin/warn-about-foo'], 'function');
		t.assert.strictEqual(plugins.length, 1);
		t.assert.match(plugins[0], /plugin-warn-about-foo/);
		t.assert.deepStrictEqual(rest, {
			rules: {
				'block-no-empty': [true],
				'plugin/warn-about-foo': ['always'],
			},
		});
	});

	it('should use the passed config base directory', async (t) => {
		const filepath = replaceBackslashes(
			path.join(dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
		);

		const config = await stylelint.resolveConfig(filepath, {
			configBasedir: path.join(dirname, 'fixtures'),
			config: {
				extends: './config-extending-two.json',
			},
		});

		t.assert.deepStrictEqual(config, {
			rules: {
				'block-no-empty': [true],
				'color-no-invalid-hex': [true],
			},
		});
	});

	it('should use the passed cwd', async (t) => {
		const filepath = replaceBackslashes(
			path.join(dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
		);

		const config = await stylelint.resolveConfig(filepath, {
			cwd: path.join(dirname, 'fixtures'),
			config: {
				extends: './config-extending-two.json',
			},
		});

		t.assert.deepStrictEqual(config, {
			rules: {
				'block-no-empty': [true],
				'color-no-invalid-hex': [true],
			},
		});
	});
});
