import { fileURLToPath } from 'node:url';
import path from 'node:path';
import postcss from 'postcss';

import configurationError from '../utils/configurationError.mjs';
import postcssPlugin from '../postcssPlugin.js';
import safeChdir from '../testUtils/safeChdir.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

it('`config` option is `null`', () => {
	return expect(
		postcss([postcssPlugin()]).process('a {}', { from: undefined }),
	).rejects.toMatchObject({
		message: expect.stringMatching('No configuration provided'),
	});
});

it('`configFile` option with absolute path', async () => {
	const config = {
		configFile: path.join(__dirname, 'fixtures/config-block-no-empty.json'),
	};

	const postcssResult = await postcss([postcssPlugin(config)]).process('a {}', {
		from: undefined,
	});
	const warnings = postcssResult.warnings();

	expect(warnings).toHaveLength(1);
	expect(warnings[0].text).toContain('block-no-empty');
});

it('`configFile` with bad path', () => {
	return expect(
		postcss([postcssPlugin({ configFile: './herby.json' })]).process('a {}', { from: undefined }),
	).rejects.toHaveProperty('code', 'ENOENT');
});

it('`configFile` option without rules', () => {
	const config = {
		configFile: path.join(__dirname, 'fixtures/config-without-rules.json'),
	};

	return expect(
		postcss([postcssPlugin(config)]).process('a {}', { from: undefined }),
	).rejects.toEqual(
		configurationError(
			'No rules found within configuration. Have you provided a "rules" property?',
		),
	);
});

it('`configFile` option with undefined rule', () => {
	const config = {
		configFile: path.join(__dirname, 'fixtures/config-with-undefined-rule.json'),
	};
	const ruleName = 'unknown-rule';

	return expect(
		postcss([postcssPlugin(config)]).process('a {}', { from: undefined }),
	).resolves.toMatchObject({
		messages: [
			expect.objectContaining({
				line: 1,
				column: 1,
				rule: ruleName,
				text: `Unknown rule ${ruleName}.`,
				severity: 'error',
			}),
		],
	});
});

it('`ignoreFiles` options is not empty and file ignored', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
		ignoreFiles: '**/foo.css',
	};

	return expect(
		postcss([postcssPlugin(config)]).process('a {}', { from: 'foo.css' }),
	).resolves.toHaveProperty('stylelint.ignored', true);
});

it('`ignoreFiles` options is not empty and file not ignored', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
		ignoreFiles: '**/bar.css',
	};

	return expect(
		postcss([postcssPlugin(config)]).process('a {}', { from: 'foo.css' }),
	).resolves.not.toHaveProperty('stylelint.ignored');
});

describe('stylelintignore', () => {
	safeChdir(__dirname);

	it('postcssPlugin with .stylelintignore and file is ignored', () => {
		const options = {
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
		};

		return expect(
			postcss([postcssPlugin(options)]).process('a {}', { from: 'postcssstylelintignore.css' }),
		).resolves.toHaveProperty('stylelint.ignored', true);
	});

	it('postcssPlugin with ignorePath and file is ignored', () => {
		const options = {
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			ignorePath: path.join(__dirname, './stylelintignore-test/.postcssPluginignore'),
		};

		return expect(
			postcss([postcssPlugin(options)]).process('a {}', { from: 'foo.css' }),
		).resolves.toHaveProperty('stylelint.ignored', true);
	});

	it('postcssPlugin with ignorePath array and file is ignored', () => {
		const options = {
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			ignorePath: [path.join(__dirname, './stylelintignore-test/.postcssPluginignore')],
		};

		return expect(
			postcss([postcssPlugin(options)]).process('a {}', { from: 'foo.css' }),
		).resolves.toHaveProperty('stylelint.ignored', true);
	});
});

describe('stylelintignore with options.cwd', () => {
	it('postcssPlugin with .stylelintignore and file is ignored', () => {
		const options = {
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			cwd: __dirname,
		};

		return expect(
			postcss([postcssPlugin(options)]).process('a {}', {
				from: path.join(__dirname, 'postcssstylelintignore.css'),
			}),
		).resolves.toHaveProperty('stylelint.ignored', true);
	});

	it('postcssPlugin with ignorePath and file is ignored', () => {
		const options = {
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			cwd: __dirname,
			ignorePath: path.join(__dirname, './stylelintignore-test/.postcssPluginignore'),
		};

		return expect(
			postcss([postcssPlugin(options)]).process('a {}', { from: path.join(__dirname, 'foo.css') }),
		).resolves.toHaveProperty('stylelint.ignored', true);
	});

	it('postcssPlugin with ignorePath array and file is ignored', () => {
		const options = {
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			cwd: __dirname,
			ignorePath: [path.join(__dirname, './stylelintignore-test/.postcssPluginignore')],
		};

		return expect(
			postcss([postcssPlugin(options)]).process('a {}', { from: path.join(__dirname, 'foo.css') }),
		).resolves.toHaveProperty('stylelint.ignored', true);
	});
});
