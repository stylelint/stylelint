import postcssScss from 'postcss-scss';

import stylelint from '../../lib/index.js';

import { caseConfigFile, caseFiles, prepForSnapshot } from '../systemTestUtils.mjs';

const CASE_NUMBER = '002';

it('fs - invalid twbs buttons and their config', async () => {
	expect(
		prepForSnapshot(
			await stylelint.lint({
				files: caseFiles(CASE_NUMBER),
				configFile: caseConfigFile(CASE_NUMBER),
				customSyntax: postcssScss,
			}),
		),
	).toMatchSnapshot();
}, 10000);
