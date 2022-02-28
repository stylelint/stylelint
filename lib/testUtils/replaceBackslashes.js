'use strict';

/**
 * @param {string} str
 * @returns {string}
 */
module.exports = function replaceBackslashes(str) {
	return str.replace(/\\/g, '/');
};
