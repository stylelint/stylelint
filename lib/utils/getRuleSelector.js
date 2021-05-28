'use strict';

/**
 * @param {import('postcss').Rule} ruleNode
 * @returns {string}
 */
function getRuleSelector(ruleNode) {
	// Casting this to any because 'value' does not exist on type 'NodeRaws'
	/** @type {any} */
	const raws = ruleNode.raws;

	return (raws.selector && raws.selector.raw) || ruleNode.selector;
}

module.exports = getRuleSelector;
