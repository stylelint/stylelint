'use strict';

const { isAtRule } = require('./typeGuards');

/**
 * Check if a rule is a keyframe one
 *
 * @param {import('postcss').Rule} rule
 * @returns {boolean}
 */
module.exports = function isKeyframeRule(rule) {
	const parent = rule.parent;

	if (!parent) {
		return false;
	}

	return isAtRule(parent) && parent.name.toLowerCase() === 'keyframes';
};
