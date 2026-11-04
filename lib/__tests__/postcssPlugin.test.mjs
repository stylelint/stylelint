import { describe, it } from 'node:test';

import path from 'node:path';
import postcss from 'postcss';

import { ConfigurationError } from '../utils/errors.mjs';
import assertItemsPartialDeepStrictEqual from '../testUtils/assertItemsPartialDeepStrictEqual.mjs';
import postcssPlugin from '../postcssPlugin.mjs';
import safeChdir from '../testUtils/safeChdir.mjs';

const dirname = import.meta.dirname;

it('`config` option is `null`', (t) => {
	return t.assert.rejects(postcss([postcssPlugin()]).process('a {}', { from: undefined }), {
		message: /No configuration provided/,
	});
});

it('`configFile` option with absolute path', async (t) => {
	const config = {
		configFile: path.join(dirname, 'fixtures/config-block-no-empty.json'),
	};

	const postcssResult = await postcss([postcssPlugin(config)]).process('a {}', {
		from: undefined,
	});
	const warnings = postcssResult.warnings();

	t.assert.strictEqual(warnings.length, 1);
	t.assert.ok(warnings[0].text.includes('block-no-empty'));
});

it('`configFile` with bad path', (t) => {
	return t.assert.rejects(
		postcss([postcssPlugin({ configFile: './herby.json' })]).process('a {}', { from: undefined }),
		{ code: 'ENOENT' },
	);
});

it('`configFile` option without rules', (t) => {
	const config = {
		configFile: path.join(dirname, 'fixtures/config-without-rules.json'),
	};

	return t.assert.rejects(
		postcss([postcssPlugin(config)]).process('a {}', { from: undefined }),
		new ConfigurationError(
			'No rules found within configuration. Have you provided a "rules" property?',
		),
	);
});

it('`configFile` option with undefined rule', async (t) => {
	const config = {
		configFile: path.join(dirname, 'fixtures/config-with-undefined-rule.json'),
	};
	const ruleName = 'unknown-rule';

	const { messages } = await postcss([postcssPlugin(config)]).process('a {}', { from: undefined });

	t.assert.strictEqual(messages.length, 1);
	t.assert.partialDeepStrictEqual(messages[0], {
		line: 1,
		column: 1,
		rule: ruleName,
		text: `Unknown rule ${ruleName}.`,
		severity: 'error',
	});
});

it('`ignoreFiles` options is not empty and file ignored', async (t) => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
		ignoreFiles: '**/foo.css',
	};

	const { stylelint } = await postcss([postcssPlugin(config)]).process('a {}', { from: 'foo.css' });

	t.assert.strictEqual(stylelint.ignored, true);
});

it('`ignoreFiles` options is not empty and file not ignored', async (t) => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
		ignoreFiles: '**/bar.css',
	};

	const { stylelint } = await postcss([postcssPlugin(config)]).process('a {}', { from: 'foo.css' });

	t.assert.strictEqual(stylelint.ignored, undefined);
});

it('`abortSignal` option rejects when aborted while processing rules', async (t) => {
	const controller = new AbortController();

	const aborter = {
		ruleName: 'test/aborter',
		rule: () => async () => {
			controller.abort(new Error('mid-run'));
		},
	};

	await t.assert.rejects(
		postcss([
			postcssPlugin({
				abortSignal: controller.signal,
				config: { plugins: [aborter], rules: { 'test/aborter': true } },
			}),
		]).process('a {}', { from: undefined }),
		{ message: 'mid-run' },
	);
});

describe('stylelintignore', () => {
	safeChdir(dirname);

	it('postcssPlugin with .stylelintignore and file is ignored', async (t) => {
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

		t.assert.strictEqual(stylelint.ignored, true);
	});

	it('postcssPlugin with ignorePath and file is ignored', async (t) => {
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

		t.assert.strictEqual(stylelint.ignored, true);
	});

	it('postcssPlugin with ignorePath array and file is ignored', async (t) => {
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

		t.assert.strictEqual(stylelint.ignored, true);
	});
});

describe('stylelintignore with options.cwd', () => {
	it('postcssPlugin with .stylelintignore and file is ignored', async (t) => {
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

		t.assert.strictEqual(stylelint.ignored, true);
	});

	it('postcssPlugin with ignorePath and file is ignored', async (t) => {
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

		t.assert.strictEqual(stylelint.ignored, true);
	});

	it('postcssPlugin with ignorePath array and file is ignored', async (t) => {
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

		t.assert.strictEqual(stylelint.ignored, true);
	});
});

it('keeps the messages of preceding plugins when a fix makes the rules run again', async (t) => {
	const warnAboutFoo = {
		postcssPlugin: 'warn-about-foo',
		Once(_root, { result }) {
			result.warn('foo');
		},
	};
	const config = {
		rules: {
			'declaration-block-no-duplicate-properties': true,
			'property-no-vendor-prefix': true,
		},
	};

	const postcssResult = await postcss([warnAboutFoo, postcssPlugin({ config, fix: true })]).process(
		'a { -webkit-transition: opacity 1s; transition: opacity 1s; }',
		{ from: undefined },
	);

	t.assert.strictEqual(postcssResult.css, 'a { transition: opacity 1s; }');
	assertItemsPartialDeepStrictEqual(postcssResult.messages, [{ text: 'foo' }]);
});
