/* @flow */
'use strict';

const stylelint = require('../../lib');
const systemTestUtils = require('../systemTestUtils');

it('ignoreFile', () => {
	return stylelint
		.lint({
			files: [systemTestUtils.caseStylesheetGlob('ignoreFile')],
			ignorePath: require('path').join(__dirname, '.stylelintignore'),
			allowEmptyInput: true,
			configFile: systemTestUtils.caseConfig('ignoreFile'),
		})
		.then((output) => {
			expect(output).toMatchSnapshot();
		});
}, 10000);
