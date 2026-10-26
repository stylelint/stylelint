import { it } from 'node:test';

import stylelint from '../../lib/index.mjs';

import { caseCode, caseConfig, prepForSnapshot } from '../systemTestUtils.mjs';

const CASE_NUMBER = '003';

it('no-fs - zen garden CSS with standard config', { timeout: 10000 }, async (t) => {
	t.assert.snapshot(
		prepForSnapshot(
			await stylelint.lint({
				code: await caseCode(CASE_NUMBER),
				config: await caseConfig(CASE_NUMBER),
				fix: true,
			}),
		),
	);
});
