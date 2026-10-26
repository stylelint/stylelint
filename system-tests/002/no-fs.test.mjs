import { it } from 'node:test';

import postcssScss from 'postcss-scss';

import stylelint from '../../lib/index.mjs';

import { caseCode, caseConfig, prepForSnapshot } from '../systemTestUtils.mjs';

const CASE_NUMBER = '002';

it('no-fs - invalid twbs buttons and their config', { timeout: 10000 }, async (t) => {
	t.assert.snapshot(
		prepForSnapshot(
			await stylelint.lint({
				code: await caseCode(CASE_NUMBER, 'scss'),
				config: await caseConfig(CASE_NUMBER),
				customSyntax: postcssScss,
			}),
		),
	);
});
