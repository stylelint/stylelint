// NOTE: This test uses the `node:test` module because Jest's module loader
// doesn't strip types, so it can't load a TypeScript config.

import assert from 'node:assert/strict';
import test from 'node:test';

import stylelint from '../../lib/index.mjs';

import { caseFilePath } from '../systemTestUtils.mjs';

const CASE_NUMBER = '007';

test(
	'TypeScript config',
	async () => {
		const { results } = await stylelint.lint({
			files: caseFilePath(CASE_NUMBER, 'fixtures/stylesheet.css'),
			configFile: caseFilePath(CASE_NUMBER, 'fixtures/config.ts'),
		});

		assert.deepEqual(
			results.map(({ warnings }) => warnings.map(({ rule }) => rule)),
			[['color-named']],
		);
	},
	{ timeout: 20000 },
);
