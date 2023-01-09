'use strict';

/**
 * returns whether a string is a valid CSS identifier
 * (i.e. only alphanumeric characters, `-`, and `_`;
 * does not have a leading digit, leading dash followed by digit, or two leading dashes)
 * see: https://www.w3.org/TR/CSS2/syndata.html#value-def-identifier
 * @param {string} ident
 * @returns {boolean}
 */
module.exports = function isValidIdentifier(ident) {
	if (!ident || ident.trim() === '') {
		return false;
	}

	const hasDigitAt = (/** @type {number} */ i) => !isNaN(parseInt(ident.charAt(i)));

	const trimmedIdent = ident.trim();

	// characters that are not alphanumeric, hyphen or underscore
	if (trimmedIdent.match(/[^\w-]/)) {
		return false;
	}

	// string has a leading digit
	if (hasDigitAt(0)) {
		return false;
	}

	// string has a leading dash followed by a digit or a dash
	if (trimmedIdent.charAt(0) === '-' && (hasDigitAt(1) || trimmedIdent.charAt(1) === '-')) {
		return false;
	}

	return true;
};
