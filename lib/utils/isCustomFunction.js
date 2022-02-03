'use strict';

/**
 * Check whether a function is custom / user-defined
 * https://github.com/w3c/css-houdini-drafts/issues/1007
 * @param {string} func
 * @returns {boolean}
 */
module.exports = function (func) {
	return func.startsWith('--');
};
