'use strict';

const core = require('../../lib/coreEntrypoint');
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

it('no-fs - errored state standalone and core return equal results', async () => {
	expect(
		prepForSnapshot(
			await stylelint.lint({
				code: await caseCode(CASE_NUMBER),
				config: await caseConfig(CASE_NUMBER),
				reportNeedlessDisables: true,
			}),
		),
	).toStrictEqual(
		prepForSnapshot(
			await core.lint({
				code: await caseCode(CASE_NUMBER),
				// manually merge options into the config for core
				config: { ...(await caseConfig(CASE_NUMBER)), reportNeedlessDisables: true },
			}),
		),
	);
});

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

it('no-fs - no errored state standalone and core return equal results', async () => {
	expect(
		prepForSnapshot(
			await stylelint.lint({
				code: await caseCode(CASE_NUMBER),
				config: await caseConfig(CASE_NUMBER),
			}),
		),
	).toStrictEqual(
		prepForSnapshot(
			await core.lint({
				code: await caseCode(CASE_NUMBER),
				config: await caseConfig(CASE_NUMBER),
			}),
		),
	);
});
