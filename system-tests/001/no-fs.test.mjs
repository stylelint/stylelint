import { it } from 'node:test';

import stylelint from '../../lib/index.mjs';

import { caseCode, caseConfig, prepForSnapshot } from '../systemTestUtils.mjs';

const CASE_NUMBER = '001';

it('no-fs - valid sanitize.css and their config', { timeout: 10000 }, async (t) => {
	t.assert.snapshot(
		prepForSnapshot(
			await stylelint.lint({
				code: await caseCode(CASE_NUMBER),
				config: await caseConfig(CASE_NUMBER),
			}),
		),
	);
});
