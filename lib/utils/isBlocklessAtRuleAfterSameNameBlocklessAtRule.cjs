'use strict';

const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode.cjs');
const typeGuards = require('./typeGuards.cjs');
const isBlocklessAtRuleAfterBlocklessAtRule = require('./isBlocklessAtRuleAfterBlocklessAtRule.cjs');

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {boolean}
 */
function isBlocklessAtRuleAfterSameNameBlocklessAtRule(atRule) {
	if (!isBlocklessAtRuleAfterBlocklessAtRule(atRule)) {
		return false;
	}

	const previousNode = getPreviousNonSharedLineCommentNode(atRule);

	if (previousNode && typeGuards.isAtRule(previousNode)) {
		return previousNode.name === atRule.name;
	}

	return false;
}

module.exports = isBlocklessAtRuleAfterSameNameBlocklessAtRule;