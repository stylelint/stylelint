'use strict';

/** @typedef {import('stylelint').ConfigurationError} ConfigurationError */

/**
 * Create configurationError from text and set CLI exit code
 * @param {string} text
 * @returns {ConfigurationError}
 */
module.exports = function (text) {
	const err = /** @type {ConfigurationError} */ (new Error(text));

	err.code = 78;

	return err;
};
