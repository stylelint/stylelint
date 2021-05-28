'use strict';

const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode');
const isBlocklessAtRuleAfterBlocklessAtRule = require('./isBlocklessAtRuleAfterBlocklessAtRule');

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {boolean}
 */
module.exports = function (atRule) {
	if (!isBlocklessAtRuleAfterBlocklessAtRule(atRule)) {
		return false;
	}

	const previousNode = getPreviousNonSharedLineCommentNode(atRule);

	if (previousNode && 'name' in previousNode) {
		return previousNode.name === atRule.name;
	}

	return false;
};
