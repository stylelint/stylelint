import * as stylelintTestRuleNode from 'stylelint-test-rule-node';

import loadLint from './loadLint.mjs';

/**
 * @param {import('stylelint-test-rule-node').TestSchema} schema
 * @returns {void}
 */
export default function testRule(schema) {
	stylelintTestRuleNode.testRule({ loadLint, ...schema });
}
