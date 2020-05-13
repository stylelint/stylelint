'use strict';

const browser = require('../../lib/browser');
const stylint = require('../../lib');
const { caseConfig, caseCode, prepForSnapshot } = require('../systemTestUtils');

const CASE_NUMBER = '003';

describe('no-fs - zen garden CSS with standard config', () => {
	let browserResult;
	let stylintResult;

	beforeAll(async () => {
		const code = await caseCode(CASE_NUMBER);
		const config = await caseConfig(CASE_NUMBER);

		stylintResult = prepForSnapshot(await stylint.lint({ code, config, fix: true }));
		browserResult = prepForSnapshot(await browser.lint({ code, config, fix: true }));
	});

	it('standalone', async () => {
		expect(stylintResult).toMatchSnapshot();
	}, 10000);

	it('standalone and browser return equal results', async () => {
		expect(browserResult).toEqual(stylintResult);
	}, 10000);
});
