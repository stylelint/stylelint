'use strict';

/**
 * @param {unknown} value
 */
module.exports = function (value) {
	return typeof value === 'number' && value >= 0;
};
