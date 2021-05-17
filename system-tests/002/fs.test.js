'use strict';

const postcssScss = require('postcss-scss');

const stylelint = require('../../lib');
const { caseConfigFile, caseFiles, prepForSnapshot } = require('../systemTestUtils');

const CASE_NUMBER = '002';

it('fs - invalid twbs buttons and their config', async () => {
	expect(
		prepForSnapshot(
			await stylelint.lint({
				files: caseFiles(CASE_NUMBER),
				configFile: caseConfigFile(CASE_NUMBER),
				customSyntax: postcssScss,
			}),
		),
	).toMatchSnapshot();
}, 10000);
