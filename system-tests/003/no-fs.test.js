'use strict';

const core = require('../../lib/coreEntrypoint');
const stylelint = require('../../lib');
const { caseConfig, caseCode, prepForSnapshot } = require('../systemTestUtils');

const CASE_NUMBER = '003';

describe('no-fs - zen garden CSS with standard config', () => {
	let coreResult;
	let stylelintResult;

	beforeAll(async () => {
		const code = await caseCode(CASE_NUMBER);
		const config = await caseConfig(CASE_NUMBER);

		stylelintResult = prepForSnapshot(
			await stylelint.lint({
				code,
				config,
				fix: true,
			}),
		);
		coreResult = prepForSnapshot(
			await core.lint({
				code,
				config,
				fix: true,
			}),
		);
	});

	it('standalone', () => {
		expect(stylelintResult).toMatchSnapshot();
	});

	it('standalone and core return equal results', () => {
		expect(coreResult).toStrictEqual(stylelintResult);
	});
});
