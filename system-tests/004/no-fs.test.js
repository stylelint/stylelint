'use strict';

const stylelint = require('../../lib');
const { caseConfig, caseCode, prepForSnapshot } = require('../systemTestUtils');

const CASE_NUMBER = '004';

it('no-fs - errored state for reportNeedlessDisables', async () => {
	expect(
		prepForSnapshot(
			await stylelint.lint({
				code: await caseCode(CASE_NUMBER),
				config: await caseConfig(CASE_NUMBER),
				reportNeedlessDisables: true,
			}),
		),
	).toMatchSnapshot();
}, 10000);

it('no-fs - no errored state', async () => {
	expect(
		prepForSnapshot(
			await stylelint.lint({
				code: await caseCode(CASE_NUMBER),
				config: await caseConfig(CASE_NUMBER),
			}),
		),
	).toMatchSnapshot();
}, 10000);
