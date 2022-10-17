'use strict';

const path = require('path');

const createStylelint = require('../createStylelint');
const getConfigForFile = require('../getConfigForFile');
const pluginWarnAboutFoo = require('./fixtures/plugin-warn-about-foo');

test('augmented config loads', async () => {
	const stylelint = createStylelint();
	const filepath = path.join(__dirname, 'fixtures/getConfigForFile/a/b/foo.css');

	await expect(getConfigForFile(stylelint, filepath)).resolves.toEqual({
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
