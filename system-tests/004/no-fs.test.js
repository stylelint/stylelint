'use strict';

const core = require('../../lib/coreEntrypoint');
const stylelint = require('../../lib');
const { caseConfig, caseCode, prepForSnapshot } = require('../systemTestUtils');

const CASE_NUMBER = '004';

let code;
let config;

beforeAll(async () => {
	code = await caseCode(CASE_NUMBER);
	config = await caseConfig(CASE_NUMBER);
});

describe('no-fs - errored state for reportNeedlessDisables', () => {
	let coreResult;
	let stylelintResult;

	beforeAll(async () => {
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

describe('no-fs - no errored state', () => {
	let coreResult;
	let stylelintResult;

	beforeAll(async () => {
		stylelintResult = prepForSnapshot(
			await stylelint.lint({
				code,
				config,
			}),
		);
		coreResult = prepForSnapshot(
			await core.lint({
				code,
				config,
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
