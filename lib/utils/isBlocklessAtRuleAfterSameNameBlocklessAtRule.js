'use strict';

const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode');
const isBlocklessAtRuleAfterBlocklessAtRule = require('./isBlocklessAtRuleAfterBlocklessAtRule');
const { isAtRule } = require('./typeGuards');

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {boolean}
 */
module.exports = function isBlocklessAtRuleAfterSameNameBlocklessAtRule(atRule) {
	if (!isBlocklessAtRuleAfterBlocklessAtRule(atRule)) {
		return false;
	}

	const previousNode = getPreviousNonSharedLineCommentNode(atRule);

	if (previousNode && isAtRule(previousNode)) {
		return previousNode.name === atRule.name;
	}

	return false;
};
