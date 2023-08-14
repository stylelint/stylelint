'use strict';

const constants = require('../constants.cjs');

/** @typedef {Error & { code: number }} ConfigurationError */

/**
 * Create configurationError from text and set CLI exit code.
 *
 * @param {string} text
 * @returns {ConfigurationError}
 */
function configurationError(text) {
	const err = /** @type {ConfigurationError} */ (new Error(text));

	err.code = constants.EXIT_CODE_INVALID_CONFIG;

	return err;
}

module.exports = configurationError;
