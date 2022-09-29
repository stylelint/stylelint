'use strict';

/**
 * @param {string} source
 *
 * @returns {string}
 */
module.exports = function blurInterpolation(source, blurChar = ' ') {
	return source.replace(/[#@{}]+/g, blurChar);
};
