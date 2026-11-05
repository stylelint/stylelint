/** @import { Rule } from 'postcss' */

import cleanRaws from './cleanRaws.mjs';

/**
 * @param {Rule} ruleNode
 * @param {string} selector
 * @returns {Rule} The rule that was passed in.
 */
export default function setRuleSelector(ruleNode, selector) {
	const raws = ruleNode.raws;

	if (raws.selector) {
		ruleNode.selector = cleanRaws(selector);
		raws.selector.value = ruleNode.selector;
		raws.selector.raw = selector;
	} else {
		ruleNode.selector = selector;
	}

	return ruleNode;
}
