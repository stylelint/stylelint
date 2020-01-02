'use strict';

const configurationError = require('../utils/configurationError');
const path = require('path');
const postcssPlugin = require('../postcssPlugin');

it('`config` option is `null`', () => {
	return postcssPlugin
		.process('a {}', { from: undefined })
		.then(() => {
			throw new Error('should not have succeeded');
		})
		.catch((err) => {
			expect(err.message).toContain('No configuration provided');
		});
});

it('`configFile` option with absolute path', () => {
	const config = {
		configFile: path.join(__dirname, 'fixtures/config-block-no-empty.json'),
	};

	return postcssPlugin.process('a {}', { from: undefined }, config).then((postcssResult) => {
		const warnings = postcssResult.warnings();

		expect(warnings).toHaveLength(1);
		expect(warnings[0].text).toContain('block-no-empty');
	});
});

it('`configFile` with bad path', () => {
	return postcssPlugin
		.process('a {}', { from: undefined }, { configFile: './herby.json' })
		.then(() => {
			throw new Error('should not have succeeded');
		})
		.catch((err) => {
			expect(err.code).toBe('ENOENT');
		});
});

it('`configFile` option without rules', () => {
	const config = {
		configFile: path.join(__dirname, 'fixtures/config-without-rules.json'),
	};

	return postcssPlugin
		.process('a {}', { from: undefined }, config)
		.then(() => {
			throw new Error('should not have succeeded');
		})
		.catch((err) => {
			expect(err).toEqual(
				configurationError(
					'No rules found within configuration. Have you provided a "rules" property?',
				),
			);
		});
});

it('`configFile` option with undefined rule', () => {
	const config = {
		configFile: path.join(__dirname, 'fixtures/config-with-undefined-rule.json'),
	};
	const ruleName = 'unknown-rule';

	return postcssPlugin.process('a {}', { from: undefined }, config).then((result) => {
		expect(result.messages).toContainEqual(
			expect.objectContaining({
				line: 1,
				column: 1,
				rule: ruleName,
				text: `Unknown rule ${ruleName}.`,
				severity: 'error',
			}),
		);
	});
});

it('`ignoreFiles` options is not empty and file ignored', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
		ignoreFiles: '**/foo.css',
		from: 'foo.css',
	};

	return postcssPlugin.process('a {}', { from: undefined }, config).then((postcssResult) => {
		expect(postcssResult.stylelint.ignored).toBeTruthy();
	});
});

it('`ignoreFiles` options is not empty and file not ignored', () => {
	const config = {
		rules: {
			'block-no-empty': true,
		},
		ignoreFiles: '**/bar.css',
		from: 'foo.css',
	};

	return postcssPlugin.process('a {}', { from: undefined }, config).then((postcssResult) => {
		expect(postcssResult.stylelint.ignored).toBeFalsy();
	});
});

describe('stylelintignore', () => {
	let actualCwd;

	beforeEach(() => {
		actualCwd = process.cwd();
		process.chdir(__dirname);
	});

	afterEach(() => {
		process.chdir(actualCwd);
	});

	it('postcssPlugin with .stylelintignore and file is ignored', () => {
		const options = {
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			from: 'postcssstylelintignore.css',
		};

		return postcssPlugin.process('a {}', { from: undefined }, options).then((postcssResult) => {
			expect(postcssResult.stylelint.ignored).toBeTruthy();
		});
	});

	it('postcssPlugin with ignorePath and file is ignored', () => {
		const options = {
			config: {
				rules: {
					'block-no-empty': true,
				},
			},
			from: 'foo.css',
			ignorePath: path.join(__dirname, './stylelintignore-test/.postcssPluginignore'),
		};

		return postcssPlugin.process('a {}', { from: undefined }, options).then((postcssResult) => {
			expect(postcssResult.stylelint.ignored).toBeTruthy();
		});
	});
});
