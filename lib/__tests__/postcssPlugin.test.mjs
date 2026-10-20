import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import path from 'node:path';
import postcss from 'postcss';

import { ConfigurationError } from '../utils/errors.mjs';
import postcssPlugin from '../postcssPlugin.mjs';
import safeChdir from '../testUtils/safeChdir.mjs';

const dirname = import.meta.dirname;

it('`config` option is `null`', () => {
	return assert.rejects(postcss([postcssPlugin()]).process('a {}', { from: undefined }), {
		message: /No configuration provided/,
	});
});

it('`configFile` option with absolute path', async () => {
	const config = {
		configFile: path.join(dirname, 'fixtures/config-block-no-empty.json'),
	};

	const postcssResult = await postcss([postcssPlugin(config)]).process('a {}', {
		from: undefined,
	});
	const warnings = postcssResult.warnings();

	assert.equal(warnings.length, 1);
	assert.ok(warnings[0].text.includes('block-no-empty'));
});

it('`configFile` with bad path', () => {
	return assert.rejects(
		postcss([postcssPlugin({ configFile: './herby.json' })]).process('a {}', { from: undefined }),
		{ code: 'ENOENT' },
	);
});

it('`configFile` option without rules', () => {
	const config = {
		configFile: path.join(dirname, 'fixtures/config-without-rules.json'),
	};

	return assert.rejects(
		postcss([postcssPlugin(config)]).process('a {}', { from: undefined }),
		new ConfigurationError(
			'No rules found within configuration. Have you provided a "rules" property?',
		),
	);
});

it('`configFile` option with undefined rule', async () => {
	const config = {
		configFile: path.join(dirname, 'fixtures/config-with-undefined-rule.json'),
	};
	const ruleName = 'unknown-rule';

	const { messages } = await postcss([postcssPlugin(config)]).process('a {}', { from: undefined });

	assert.equal(messages.length, 1);
	assert.partialDeepStrictEqual(messages[0], {
		line: 1,
		column: 1,
		rule: ruleName,
		text: `Unknown rule ${ruleName}.`,
		severity: 'error',
	});
});

it('`ignoreFiles` options is not empty and file ignored', async () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
		ignoreFiles: '**/foo.css',
	};

	const { stylelint } = await postcss([postcssPlugin(config)]).process('a {}', { from: 'foo.css' });

	assert.equal(stylelint.ignored, true);
});

it('`ignoreFiles` options is not empty and file not ignored', async () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
		ignoreFiles: '**/bar.css',
	};

	const { stylelint } = await postcss([postcssPlugin(config)]).process('a {}', { from: 'foo.css' });

	assert.equal(stylelint.ignored, undefined);
});

describe('stylelintignore', () => {
	safeChdir(dirname);

	it('postcssPlugin with .stylelintignore and file is ignored', async () => {
		const options = {
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
		};

		const { stylelint } = await postcss([postcssPlugin(options)]).process('a {}', {
			from: 'postcssstylelintignore.css',
		});

		assert.equal(stylelint.ignored, true);
	});

	it('postcssPlugin with ignorePath and file is ignored', async () => {
		const options = {
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			ignorePath: path.join(dirname, './stylelintignore-test/.postcssPluginignore'),
		};

		const { stylelint } = await postcss([postcssPlugin(options)]).process('a {}', {
			from: 'foo.css',
		});

		assert.equal(stylelint.ignored, true);
	});

	it('postcssPlugin with ignorePath array and file is ignored', async () => {
		const options = {
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			ignorePath: [path.join(dirname, './stylelintignore-test/.postcssPluginignore')],
		};

		const { stylelint } = await postcss([postcssPlugin(options)]).process('a {}', {
			from: 'foo.css',
		});

		assert.equal(stylelint.ignored, true);
	});
});

describe('stylelintignore with options.cwd', () => {
	it('postcssPlugin with .stylelintignore and file is ignored', async () => {
		const options = {
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			cwd: dirname,
		};

		const { stylelint } = await postcss([postcssPlugin(options)]).process('a {}', {
			from: path.join(dirname, 'postcssstylelintignore.css'),
		});

		assert.equal(stylelint.ignored, true);
	});

	it('postcssPlugin with ignorePath and file is ignored', async () => {
		const options = {
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			cwd: dirname,
			ignorePath: path.join(dirname, './stylelintignore-test/.postcssPluginignore'),
		};

		const { stylelint } = await postcss([postcssPlugin(options)]).process('a {}', {
			from: path.join(dirname, 'foo.css'),
		});

		assert.equal(stylelint.ignored, true);
	});

	it('postcssPlugin with ignorePath array and file is ignored', async () => {
		const options = {
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			cwd: dirname,
			ignorePath: [path.join(dirname, './stylelintignore-test/.postcssPluginignore')],
		};

		const { stylelint } = await postcss([postcssPlugin(options)]).process('a {}', {
			from: path.join(dirname, 'foo.css'),
		});

		assert.equal(stylelint.ignored, true);
	});
});
