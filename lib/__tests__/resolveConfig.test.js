'use strict';

const path = require('path');
const pluginWarnAboutFoo = require('./fixtures/plugin-warn-about-foo');
const replaceBackslashes = require('../testUtils/replaceBackslashes');
const stylelint = require('..');

it('resolveConfig uses getConfigForFile to retrieve the config', () => {
	const filepath = replaceBackslashes(
		path.join(__dirname, 'fixtures/getConfigForFile/a/b/foo.css'),
	);

	return stylelint.resolveConfig(filepath).then((result) => {
		expect(result).toEqual({
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
});

it('config overrides should apply', () => {
	const filepath = replaceBackslashes(
		path.join(__dirname, 'fixtures/config-overrides/testPrintConfig/style.css'),
	);

	return stylelint.resolveConfig(filepath).then((result) => {
		expect(result).toEqual({
			rules: {
				'block-no-empty': [true],
				'color-named': ['never'],
			},
		});
	});
});

it('resolveConfig with no path should resolve to null', () => {
	return expect(stylelint.resolveConfig()).resolves.toBeNull();
});
