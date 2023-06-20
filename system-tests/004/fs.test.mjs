import stylelint from '../../lib/index.js';

import { caseConfigFile, caseFilesForFix, prepForSnapshot } from '../systemTestUtils.mjs';

const CASE_NUMBER = '004';

it('fs - errored state for reportNeedlessDisables', async () => {
	expect(
		prepForSnapshot(
			await stylelint.lint({
				files: await caseFilesForFix(CASE_NUMBER),
				configFile: caseConfigFile(CASE_NUMBER),
				reportNeedlessDisables: true,
			}),
		),
	).toMatchSnapshot();
}, 10000);

it('fs - no errored state', async () => {
	expect(
		prepForSnapshot(
			await stylelint.lint({
				files: await caseFilesForFix(CASE_NUMBER),
				configFile: caseConfigFile(CASE_NUMBER),
			}),
		),
	).toMatchSnapshot();
}, 10000);
