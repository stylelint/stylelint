// NOTICE: This file is generated by Rollup. If you want to change,
// please edit its ESM version file instead of this one.
'use strict';

/**
 * Check whether a word is a variable i.e var(--custom-property).
 *
 * @param {string} word
 * @returns {boolean}
 */
function isVariable(word) {
	return word.toLowerCase().startsWith('var(');
}

module.exports = isVariable;
