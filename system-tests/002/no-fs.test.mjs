import postcssScss from 'postcss-scss';

import stylelint from '../../lib/index.js';

import { caseCode, caseConfig, prepForSnapshot } from '../systemTestUtils.mjs';

const CASE_NUMBER = '002';

it('no-fs - invalid twbs buttons and their config', async () => {
	expect(
		prepForSnapshot(
			await stylelint.lint({
				code: await caseCode(CASE_NUMBER, 'scss'),
				config: await caseConfig(CASE_NUMBER),
				customSyntax: postcssScss,
			}),
		),
	).toMatchSnapshot();
}, 10000);
