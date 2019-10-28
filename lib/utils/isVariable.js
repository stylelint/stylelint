/* @flow */
'use strict';

/**
 * Check whether a word is a variable i.e var(--custom-property).
 *
 * @param {string} word
 * @returns {boolean}
 */
module.exports = function(word /*: string*/) /*: boolean*/ {
	return word.toLowerCase().slice(0, 4) === 'var(';
};
