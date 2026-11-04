/** @import { Rule } from 'postcss' */

/**
 * @param {Rule} ruleNode
 * @param {string} selector
 * @returns {Rule} The rule that was passed in.
 */
export default function setRuleSelector(ruleNode, selector) {
	const raws = ruleNode.raws;

	if (raws.selector) {
		raws.selector.raw = selector;
	} else {
		ruleNode.selector = selector;
	}

	return ruleNode;
}
