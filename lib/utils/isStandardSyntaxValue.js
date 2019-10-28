/* @flow */
'use strict';

const hasInterpolation = require('../utils/hasInterpolation');

/**
 * Check whether a value is standard
 *
 * @param {string} value
 * @returns {boolean}
 */
module.exports = function(value /*: string*/) /*: boolean*/ {
	let normalizedValue = value;

	// Ignore operators before variables (example -$variable)
	if (/^[-+*/]/.test(value[0])) {
		normalizedValue = normalizedValue.slice(1);
	}

	// SCSS variable
	if (normalizedValue[0] === '$') {
		return false;
	}

	// Less variable
	if (normalizedValue[0] === '@') {
		return false;
	}

	// SCSS or Less interpolation
	if (hasInterpolation(normalizedValue)) {
		return false;
	}

	return true;
};
