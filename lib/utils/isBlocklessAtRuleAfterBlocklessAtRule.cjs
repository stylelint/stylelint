'use strict';

const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode.cjs');
const hasBlock = require('./hasBlock.cjs');
const typeGuards = require('./typeGuards.cjs');

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {boolean}
 */
function isBlocklessAtRuleAfterBlocklessAtRule(atRule) {
	if (atRule.type !== 'atrule') {
		return false;
	}

	const previousNode = getPreviousNonSharedLineCommentNode(atRule);

	if (previousNode === undefined) {
		return false;
	}

	return typeGuards.isAtRule(previousNode) && !hasBlock(previousNode) && !hasBlock(atRule);
}

module.exports = isBlocklessAtRuleAfterBlocklessAtRule;
