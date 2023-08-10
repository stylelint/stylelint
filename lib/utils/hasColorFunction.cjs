'use strict';

const functions = require('../reference/functions.cjs');

const HAS_COLOR_FUNCTION = new RegExp(`\\b(?:${[...functions.colorFunctions.values()].join('|')})\\(`, 'i');

/**
 * Check if a value contains any standard CSS color function
 *
 * @param {string} value
 * @returns {boolean}
 */
function hasColorFunction(value) {
	return HAS_COLOR_FUNCTION.test(value);
}

module.exports = hasColorFunction;
