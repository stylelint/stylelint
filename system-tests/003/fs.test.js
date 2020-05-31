'use strict';

const stylelint = require('../../lib');
const { caseConfigFile, caseFilesForFix, prepForSnapshot } = require('../systemTestUtils');

const CASE_NUMBER = '003';

it('no-fs - zen garden CSS with standard config', async () => {
	expect(
		prepForSnapshot(
			await stylelint.lint({
				files: await caseFilesForFix(CASE_NUMBER),
				configFile: caseConfigFile(CASE_NUMBER),
				fix: true,
			}),
		),
	).toMatchSnapshot();
}, 10000);
