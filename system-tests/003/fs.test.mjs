import stylelint from '../../lib/index.js';

import { caseConfigFile, caseFilesForFix, prepForSnapshot } from '../systemTestUtils.mjs';

const CASE_NUMBER = '003';

it('fs - zen garden CSS with standard config', async () => {
	expect(
		prepForSnapshot(
			await stylelint.lint({
				files: await caseFilesForFix(CASE_NUMBER),
				configFile: caseConfigFile(CASE_NUMBER),
				fix: true,
			}),
		),
	).toMatchSnapshot();
}, 10000);
