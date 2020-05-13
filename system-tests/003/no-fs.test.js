'use strict';

const browser = require('../../lib/browser');
const stylelint = require('../../lib');
const { caseConfig, caseCode, prepForSnapshot } = require('../systemTestUtils');

const CASE_NUMBER = '003';

describe('lint string', () => {
	let browserResult;
	let stylelintResult;

	beforeAll(async () => {
		const code = await caseCode(CASE_NUMBER);
		const config = await caseConfig(CASE_NUMBER);

		stylelintResult = prepForSnapshot(await stylelint.lint({ code, config, fix: true }));
		browserResult = prepForSnapshot(await browser.lint({ code, config, fix: true }));
	});

	it('no-fs - zen garden CSS with standard config', async () => {
		expect(stylelintResult).toMatchSnapshot();
	}, 10000);

	it('browser - zen garden CSS with standard config', async () => {
		expect(browserResult).toMatchSnapshot();
	}, 10000);

	it('no-fs and browser assertions produce equal results', async () => {
		expect(browserResult).toEqual(stylelintResult);
	}, 10000);
});
