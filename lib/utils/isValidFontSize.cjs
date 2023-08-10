'use strict';

const valueParser = require('postcss-value-parser');
const keywords = require('../reference/keywords.cjs');
const units = require('../reference/units.cjs');

/**
 * Check if a word is a font-size value.
 *
 * @param {string} word
 * @returns {boolean}
 */
function isValidFontSize(word) {
	if (!word) {
		return false;
	}

	if (keywords.fontSizeKeywords.has(word)) {
		return true;
	}

	const numberUnit = valueParser.unit(word);

	if (!numberUnit) {
		return false;
	}

	const unit = numberUnit.unit;

	if (unit === '%') {
		return true;
	}

	if (units.lengthUnits.has(unit.toLowerCase())) {
		return true;
	}

	return false;
}

module.exports = isValidFontSize;
