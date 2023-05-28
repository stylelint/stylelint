'use strict';

const { namedColorsKeywords } = require('../reference/keywords');

const HAS_NAMED_COLOR = new RegExp(
	`(?:^|[^\\w-])(?:${[...namedColorsKeywords.values()].join('|')})(?:$|[^\\w-])`,
	'i',
);

/**
 * Check if a value contains any standard CSS named color
 *
 * `transparent` and `currentcolor` are not named colors
 *
 * @param {string} value
 * @returns {boolean}
 */
module.exports = function hasNamedColor(value) {
	return HAS_NAMED_COLOR.test(value);
};
