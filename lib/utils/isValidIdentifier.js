'use strict';

/**
 * returns whether a string is a valid CSS identifier
 * (i.e. only alphanumeric characters, `-`, and `_`;
 * does not have a leading digit, leading dash followed by digit, or two leading dashes)
 * furthermore, any escaped or ISO 10646 characters are allowed.
 * see: https://www.w3.org/TR/CSS2/syndata.html#value-def-identifier
 * @param {string} ident
 * @returns {boolean}
 */
module.exports = function isValidIdentifier(ident) {
	if (!ident || ident.trim() === '') {
		return false;
	}

	const hasDigitAt = (/** @type {number} */ i) => !isNaN(parseInt(ident.charAt(i)));

	// trims, removes ISO 10646 characters, and singly-escaped characters
	const trimmedIdent = ident
		.trim()
		.replace(/\\[0-9a-f]{1,6}(\\r\\n|[ \t\r\n\f])?/gi, '')
		.replace(/\\./g, '');

	// characters that are not alphanumeric, hyphen or underscore
	if (trimmedIdent.match(/[^\w-]/)) {
		return false;
	}

	// ident has a leading digit
	if (hasDigitAt(0)) {
		return false;
	}

	// ident has a leading dash followed by a digit or a dash
	if (trimmedIdent.charAt(0) === '-' && (hasDigitAt(1) || trimmedIdent.charAt(1) === '-')) {
		return false;
	}

	return true;
};
