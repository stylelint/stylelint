'use strict';

/**
 * @param {string} source
 *
 * @returns {string}
 */
module.exports = function blurComments(source, blurChar = '`') {
	return source.replace(/\/\*.*\*\//g, blurChar);
};
