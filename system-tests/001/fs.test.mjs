import { it } from 'node:test';

import stylelint from '../../lib/index.mjs';

import { caseConfigFile, caseFiles, prepForSnapshot } from '../systemTestUtils.mjs';

const CASE_NUMBER = '001';

it('fs - valid sanitize.css and their config', { timeout: 10000 }, async (t) => {
	t.assert.snapshot(
		prepForSnapshot(
			await stylelint.lint({
				files: caseFiles(CASE_NUMBER),
				configFile: caseConfigFile(CASE_NUMBER),
			}),
		),
	);
});
