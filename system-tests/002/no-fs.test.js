'use strict';

const core = require('../../lib/coreEntrypoint');
const postcssScss = require('postcss-scss');
const stylelint = require('../../lib');
const { caseConfig, caseCode, prepForSnapshot } = require('../systemTestUtils');

const CASE_NUMBER = '002';

describe('no-fs - invalid twbs buttons and their config', () => {
	let coreResult;
	let stylelintResult;

	beforeAll(async () => {
		const code = await caseCode(CASE_NUMBER, 'scss');
		const config = await caseConfig(CASE_NUMBER);

		stylelintResult = prepForSnapshot(
			await stylelint.lint({ code, config, customSyntax: postcssScss }),
		);
		coreResult = prepForSnapshot(await core.lint({ code, config, customSyntax: postcssScss }));
	});

	it('standalone', () => {
		expect(stylelintResult).toMatchSnapshot();
	});

	it('standalone and core return equal results', () => {
		expect(coreResult).toStrictEqual(stylelintResult);
	});
});
