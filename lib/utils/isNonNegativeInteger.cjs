'use strict';

/**
 * @param {unknown} value
 */
function isNonNegativeInteger(value) {
	return Number.isInteger(value) && typeof value === 'number' && value >= 0;
}

module.exports = isNonNegativeInteger;
