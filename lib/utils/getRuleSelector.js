'use strict';

/**
 * @param {import('postcss').Rule} ruleNode
 * @returns {string}
 */
module.exports = function getRuleSelector(ruleNode) {
	const raws = ruleNode.raws;

	return (raws.selector && raws.selector.raw) || ruleNode.selector;
};
