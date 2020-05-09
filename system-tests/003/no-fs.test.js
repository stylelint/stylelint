'use strict';

const stylelint = require('../../lib');
const { caseConfig, caseCode, prepForSnapshot } = require('../systemTestUtils');

const CASE_NUMBER = '003';

it('no-fs - zen garden CSS with standard config', async () => {
	expect(
		prepForSnapshot(
			await stylelint.lint({
				code: await caseCode(CASE_NUMBER),
				config: await caseConfig(CASE_NUMBER),
				fix: true,
			}),
		),
	).toMatchSnapshot();
}, 10000);
