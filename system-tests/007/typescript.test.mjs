import test from 'node:test';

import stylelint from '../../lib/index.mjs';

import { caseFilePath } from '../systemTestUtils.mjs';

const CASE_NUMBER = '007';

test(
	'TypeScript config',
	async (t) => {
		const { results } = await stylelint.lint({
			files: caseFilePath(CASE_NUMBER, 'fixtures/stylesheet.css'),
			configFile: caseFilePath(CASE_NUMBER, 'fixtures/config.ts'),
		});

		t.assert.deepStrictEqual(
			results.map(({ warnings }) => warnings.map(({ rule }) => rule)),
			[['color-named']],
		);
	},
	{ timeout: 20000 },
);
