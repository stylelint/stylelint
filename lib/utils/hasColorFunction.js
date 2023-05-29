'use strict';

const { colorFunctions } = require('../reference/functions');

const HAS_COLOR_FUNCTION = new RegExp(`\\b(?:${[...colorFunctions.values()].join('|')})\\(`, 'i');

/**
 * Check if a value contains any standard CSS color function
 *
 * @param {string} value
 * @returns {boolean}
 */
module.exports = function hasColorFunction(value) {
	return HAS_COLOR_FUNCTION.test(value);
};
