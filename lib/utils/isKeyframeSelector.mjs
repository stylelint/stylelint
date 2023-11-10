import { keyframeSelectorKeywords } from '../reference/keywords.mjs';

/**
 * Check whether a string is a keyframe selector.
 *
 * @param {string} selector
 * @returns {boolean}
 */
export default function isKeyframeSelector(selector) {
	if (keyframeSelectorKeywords.has(selector)) {
		return true;
	}

	// Percentages
	if (/^(?:\d+|\d*\.\d+)%$/.test(selector)) {
		return true;
	}

	return false;
}
