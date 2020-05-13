'use strict';

const browser = require('../../lib/browser');
const stylint = require('../../lib');
const { caseConfig, caseCode, prepForSnapshot } = require('../systemTestUtils');

const CASE_NUMBER = '001';

describe('no-fs - valid sanitize.css and their config', () => {
	let browserResult;
	let stylintResult;

	beforeAll(async () => {
		const code = await caseCode(CASE_NUMBER);
		const config = await caseConfig(CASE_NUMBER);

		stylintResult = prepForSnapshot(await stylint.lint({ code, config }));
		browserResult = prepForSnapshot(await browser.lint({ code, config }));
	});

	it('standalone', async () => {
		expect(stylintResult).toMatchSnapshot();
	}, 10000);

	it('standalone and browser return equal results', async () => {
		expect(browserResult).toEqual(stylintResult);
	}, 10000);
});
