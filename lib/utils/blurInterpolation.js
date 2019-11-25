/* @flow */
'use strict';

/**
 * @param {string} source
 *
 * @returns {string}
 */
module.exports = function(source /*: string */, blurChar /*:: ?: string */ = ' ') /*: string*/ {
	return source.replace(/[#@{}]+/g, blurChar);
};
