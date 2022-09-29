'use strict';

const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode');
const hasBlock = require('./hasBlock');
const { isAtRule } = require('./typeGuards');

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {boolean}
 */
module.exports = function isBlocklessAtRuleAfterBlocklessAtRule(atRule) {
	if (atRule.type !== 'atrule') {
		return false;
	}

	const previousNode = getPreviousNonSharedLineCommentNode(atRule);

	if (previousNode === undefined) {
		return false;
	}

	return isAtRule(previousNode) && !hasBlock(previousNode) && !hasBlock(atRule);
};
