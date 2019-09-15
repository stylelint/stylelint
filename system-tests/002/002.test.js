/* @flow */
'use strict';

const stylelint = require('../../lib');
const systemTestUtils = require('../systemTestUtils');

it('002', () => {
	return stylelint
		.lint({
			files: [systemTestUtils.caseStylesheetGlob('002')],
			configFile: systemTestUtils.caseConfig('002'),
		})
		.then((output) => {
			expect(systemTestUtils.prepResults(output.results)).toMatchSnapshot();
		});
});
