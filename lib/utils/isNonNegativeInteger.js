'use strict';

/**
 * @param {unknown} value
 */
module.exports = function isNonNegativeInteger(value) {
	return Number.isInteger(value) && typeof value === 'number' && value >= 0;
};
