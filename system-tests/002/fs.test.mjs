import { it } from 'node:test';

import postcssScss from 'postcss-scss';

import stylelint from '../../lib/index.mjs';

import { caseConfigFile, caseFiles, prepForSnapshot } from '../systemTestUtils.mjs';

const CASE_NUMBER = '002';

it('fs - invalid twbs buttons and their config', { timeout: 10000 }, async (t) => {
	t.assert.snapshot(
		prepForSnapshot(
			await stylelint.lint({
				files: caseFiles(CASE_NUMBER),
				configFile: caseConfigFile(CASE_NUMBER),
				customSyntax: postcssScss,
			}),
		),
	);
});
