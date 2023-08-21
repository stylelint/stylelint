'use strict';

/**
 * @param {string} source
 * @param {string} [blurChar]
 * @returns {string}
 */
function blurInterpolation(source, blurChar = ' ') {
	return source.replace(/[#@{}]+/g, blurChar);
}

module.exports = blurInterpolation;
