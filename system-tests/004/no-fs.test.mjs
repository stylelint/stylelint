import { it } from 'node:test';

import stylelint from '../../lib/index.mjs';

import { caseCode, caseConfig, prepForSnapshot } from '../systemTestUtils.mjs';

const CASE_NUMBER = '004';

it('no-fs - errored state for reportNeedlessDisables', { timeout: 10000 }, async (t) => {
	t.assert.snapshot(
		prepForSnapshot(
			await stylelint.lint({
				code: await caseCode(CASE_NUMBER),
				config: await caseConfig(CASE_NUMBER),
				reportNeedlessDisables: true,
			}),
		),
	);
});

it('no-fs - no errored state', { timeout: 10000 }, async (t) => {
	t.assert.snapshot(
		prepForSnapshot(
			await stylelint.lint({
				code: await caseCode(CASE_NUMBER),
				config: await caseConfig(CASE_NUMBER),
			}),
		),
	);
});
