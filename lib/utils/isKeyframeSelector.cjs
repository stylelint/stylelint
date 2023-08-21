'use strict';

const keywords = require('../reference/keywords.cjs');

/**
 * Check whether a string is a keyframe selector.
 *
 * @param {string} selector
 * @returns {boolean}
 */
function isKeyframeSelector(selector) {
	if (keywords.keyframeSelectorKeywords.has(selector)) {
		return true;
	}

	// Percentages
	if (/^(?:\d+|\d*\.\d+)%$/.test(selector)) {
		return true;
	}

	return false;
}

module.exports = isKeyframeSelector;
