import stylelint from '../../lib/index.mjs';

import { caseCode, caseConfig, prepForSnapshot } from '../systemTestUtils.mjs';

const CASE_NUMBER = '006';

it('no-fs - import packages', async () => {
	expect(
		prepForSnapshot(
			await stylelint.lint({
				code: await caseCode(CASE_NUMBER),
				config: await caseConfig(CASE_NUMBER),
			}),
		),
	).toMatchSnapshot();
}, 10000);
