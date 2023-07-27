'use strict';

const typeGuards = require('./typeGuards.cjs');

/**
 * Check if a rule is a keyframe one
 *
 * @param {import('postcss').Rule} rule
 * @returns {boolean}
 */
function isKeyframeRule(rule) {
	const parent = rule.parent;

	if (!parent) {
		return false;
	}

	return typeGuards.isAtRule(parent) && parent.name.toLowerCase() === 'keyframes';
}

module.exports = isKeyframeRule;
