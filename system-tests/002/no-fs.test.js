'use strict';

const browser = require('../../lib/browser');
const scss = require('../../lib/syntaxes/syntax-scss');
const stylelint = require('../../lib');
const { caseConfig, caseCode, prepForSnapshot } = require('../systemTestUtils');

const CASE_NUMBER = '002';

describe('lint string', () => {
	let browserResult;
	let stylelintResult;

	beforeAll(async () => {
		const code = await caseCode(CASE_NUMBER, 'scss');
		const config = await caseConfig(CASE_NUMBER);

		stylelintResult = prepForSnapshot(await stylelint.lint({ code, config, syntax: 'scss' }));
		browserResult = prepForSnapshot(await browser.lint({ code, config, customSyntax: scss }));
	});

	it('no-fs - invalid twbs buttons and their config', async () => {
		expect(stylelintResult).toMatchSnapshot();
	}, 10000);

	it('browser - invalid twbs buttons and their config', async () => {
		expect(browserResult).toMatchSnapshot();
	}, 10000);

	it('browser and no-fs assertions produce equal results', async () => {
		expect(browserResult).toEqual(stylelintResult);
	}, 10000);
});
