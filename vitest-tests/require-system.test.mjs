import { expect, it } from 'vitest';
import { createRequire } from 'node:module';

import { caseCode, caseConfigFile, prepForSnapshot } from '../system-tests/systemTestUtils.mjs';

const require = createRequire(import.meta.url);
const stylelint = require('../lib/index.mjs').default;

const CASE_NUMBER = '005';

it('should lint with ESM require', async () => {
	const result = await stylelint.lint({
		code: await caseCode(CASE_NUMBER),
		configFile: await caseConfigFile(CASE_NUMBER, 'cjs'),
	});

	expect(prepForSnapshot(result)).toMatchSnapshot();
});
