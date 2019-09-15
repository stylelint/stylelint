'use strict';

const path = require('path');
const pluginWarnAboutFoo = require('./fixtures/plugin-warn-about-foo');
const stylelint = require('..');

it('createLinter().getConfigForFile augmented config loads', () => {
	const linter = stylelint.createLinter();
	const filepath = path.join(__dirname, 'fixtures/getConfigForFile/a/b/foo.css');

	return linter.getConfigForFile(filepath).then((result) => {
		expect(result).toEqual({
			config: {
				plugins: [path.join(__dirname, '/fixtures/plugin-warn-about-foo.js')],
				rules: {
					'block-no-empty': [true],
					'plugin/warn-about-foo': ['always'],
				},
				pluginFunctions: {
					'plugin/warn-about-foo': pluginWarnAboutFoo.rule,
				},
			},
			filepath: path.join(__dirname, 'fixtures/getConfigForFile/a/.stylelintrc'),
		});
	});
});

it('createLinter().isPathIgnored', () => {
	const config = {
		ignoreFiles: ['**/*.css', '!**/invalid-hex.css'],
		rules: { 'block-no-empty': true },
	};
	const linter = stylelint.createLinter({ config });

	return Promise.all([
		linter.isPathIgnored('a.css'),
		linter.isPathIgnored('foo/bar/baz.css'),
		linter.isPathIgnored('foo/bar/baz.scss'),
		linter.isPathIgnored('foo/invalid-hex.css'),
	]).then((results) => {
		expect(results).toEqual([true, true, false, false]);
	});
});
