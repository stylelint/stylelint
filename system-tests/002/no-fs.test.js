'use strict';

const core = require('../../lib/core-entrypoint');
const scss = require('../../lib/syntaxes/syntax-scss');
const stylint = require('../../lib');
const { caseConfig, caseCode, prepForSnapshot } = require('../systemTestUtils');

const CASE_NUMBER = '002';

describe('no-fs - invalid twbs buttons and their config', () => {
	let coreResult;
	let stylelintResult;

	beforeAll(async () => {
		const code = await caseCode(CASE_NUMBER, 'scss');
		const config = await caseConfig(CASE_NUMBER);

		stylelintResult = prepForSnapshot(await stylint.lint({ code, config, syntax: 'scss' }));
		coreResult = prepForSnapshot(await core.lint({ code, config, customSyntax: scss }));
	});

	it('standalone', async () => {
		expect(stylelintResult).toMatchSnapshot();
	}, 10000);

	it('standalone and core return equal results', async () => {
		expect(coreResult).toEqual(stylelintResult);
	}, 10000);
});
