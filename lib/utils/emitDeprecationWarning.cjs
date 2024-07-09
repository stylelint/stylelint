// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const process = require('node:process');
const validateTypes = require('./validateTypes.cjs');

// Each code must be unique.
const CODES = {
	COMMONJS_PLUGINS: '001',
	COMMONJS_NODEJS_API: '002',
	RESULT_OUTPUT_PROPERTY: '003',
};

/**
 * Use this function for deprecation warnings, instead of `process.emitWarning()`.
 *
 * @param {string} message
 * @param {keyof CODES} codeKey
 * @param {string} detail
 * @returns {void}
 */
function emitDeprecationWarning(message, codeKey, detail) {
	const code = CODES[codeKey];

	validateTypes.assertString(code);
	process.emitWarning(message, { type: 'DeprecationWarning', code: `stylelint:${code}`, detail });
}

module.exports = emitDeprecationWarning;
