'use strict';

const { keyframeSelectorKeywords } = require('../reference/keywords');

/**
 * Check whether a string is a keyframe selector.
 *
 * @param {string} selector
 * @returns {boolean}
 */
module.exports = function (selector) {
	if (keyframeSelectorKeywords.has(selector)) {
		return true;
	}

	// Percentages
	if (/^(?:\d+|\d*\.\d+)%$/.test(selector)) {
		return true;
	}

	return false;
};
