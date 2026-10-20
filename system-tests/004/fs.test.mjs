import { it } from 'node:test';

import stylelint from '../../lib/index.mjs';

import { caseConfigFile, caseFilesForFix, prepForSnapshot } from '../systemTestUtils.mjs';

const CASE_NUMBER = '004';

it('fs - errored state for reportNeedlessDisables', { timeout: 10000 }, async (t) => {
	t.assert.snapshot(
		prepForSnapshot(
			await stylelint.lint({
				files: await caseFilesForFix(CASE_NUMBER),
				configFile: caseConfigFile(CASE_NUMBER),
				reportNeedlessDisables: true,
			}),
		),
	);
});

it('fs - no errored state', { timeout: 10000 }, async (t) => {
	t.assert.snapshot(
		prepForSnapshot(
			await stylelint.lint({
				files: await caseFilesForFix(CASE_NUMBER),
				configFile: caseConfigFile(CASE_NUMBER),
			}),
		),
	);
});
