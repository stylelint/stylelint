'use strict';

const core = require('../../lib/coreEntrypoint');
const stylelint = require('../../lib');
const { caseConfig, caseCode, prepForSnapshot } = require('../systemTestUtils');

const CASE_NUMBER = '001';

describe('no-fs - valid sanitize.css and their config', () => {
	let coreResult;
	let stylelintResult;

	beforeAll(async () => {
		const code = await caseCode(CASE_NUMBER);
		const config = await caseConfig(CASE_NUMBER);

		stylelintResult = prepForSnapshot(await stylelint.lint({ code, config }));
		coreResult = prepForSnapshot(await core.lint({ code, config }));
	});

	it('standalone', () => {
		expect(stylelintResult).toMatchSnapshot();
	});

	it('standalone and core return equal results', () => {
		expect(coreResult).toStrictEqual(stylelintResult);
	});
});
