import * as stylelintTestRuleNode from 'stylelint-test-rule-node';

import loadLint from './loadLint.mjs';

/**
 * @param {import('stylelint-test-rule-node').RuleConfigTestSchema} schema
 * @returns {void}
 */
export default function testRuleConfigs(schema) {
	stylelintTestRuleNode.testRuleConfigs({ loadLint, ...schema });
}
