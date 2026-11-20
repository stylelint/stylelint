import { atRuleRegexes } from './regexes.mjs';
import { isAtRule } from './typeGuards.mjs';

/**
 * Check if a rule is a keyframe one
 *
 * @param {import('postcss').Rule} rule
 * @returns {boolean}
 */
export default function isKeyframeRule(rule) {
	const parent = rule.parent;

	if (!parent) {
		return false;
	}

	return isAtRule(parent) && atRuleRegexes.keyframesName.test(parent.name);
}
