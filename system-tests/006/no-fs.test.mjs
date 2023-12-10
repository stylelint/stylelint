import process from 'node:process';

import stylelint from '../../lib/index.mjs';

import { caseCode, caseConfig, prepForSnapshot } from '../systemTestUtils.mjs';

const CASE_NUMBER = '006';

// TODO: This test fails due to SIGSEGV on Node.js 18 for some reason.
// Remove the skip when dropping the support for Node.js 18.
const [nodeMajorVersion] = process.versions.node.split('.', 1);
const testFn = Number(nodeMajorVersion) >= 20 ? test : test.skip;

testFn(
	'no-fs - import packages',
	async () => {
		// eslint-disable-next-line jest/no-standalone-expect -- False positive.
		expect(
			prepForSnapshot(
				await stylelint.lint({
					code: await caseCode(CASE_NUMBER),
					config: await caseConfig(CASE_NUMBER),
				}),
			),
		).toMatchSnapshot();
	},
	10000,
);
