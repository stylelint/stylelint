/** @typedef {Error & { code: number }} ConfigurationError */

/**
 * Create configurationError from text and set CLI exit code.
 *
 * @param {string} text
 * @returns {ConfigurationError}
 */
export default function configurationError(text) {
	const err = /** @type {ConfigurationError} */ (new Error(text));

	err.code = 78;

	return err;
}
