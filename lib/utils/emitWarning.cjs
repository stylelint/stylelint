// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const process = require('node:process');

// Each code must be unique across all warning types.
const DEPRECATION_CODES = {
	COMMONJS_PLUGINS: '001',
	COMMONJS_NODEJS_API: '002',
	RESULT_OUTPUT_PROPERTY: '003',
	GITHUB_FORMATTER: '004',
	CONTEXT_FIX: '005',
	RULE: '006', // either removal or renaming
	REPORT_AMBIGUOUS_POSITION: '007',
};

const EXPERIMENTAL_CODES = {
	SUPPRESSIONS: '008',
};

const emittedWarnings = new Set();

/**
 * @typedef {typeof DEPRECATION_CODES[keyof typeof DEPRECATION_CODES] |
 *           typeof EXPERIMENTAL_CODES[keyof typeof EXPERIMENTAL_CODES]} WarningCode
 */

/**
 * Emit a warning with the specified type.
 *
 * @param {string} message
 * @param {'DeprecationWarning' | 'ExperimentalWarning'} type - See https://nodejs.org/api/process.html#nodejs-warning-names
 * @param {WarningCode} code
 * @param {string} detail
 * @returns {void}
 */
function emitWarning(message, type, code, detail) {
	const key = JSON.stringify({
		message,
		options: { type, code: `stylelint:${code}`, detail },
	});

	if (emittedWarnings.has(key)) return;

	emittedWarnings.add(key);

	process.emitWarning(message, { type, code: `stylelint:${code}`, detail });
}

/**
 * Use this function for deprecation warnings, instead of `process.emitWarning()`.
 *
 * @param {string} message
 * @param {keyof typeof DEPRECATION_CODES} codeKey
 * @param {string} detail
 * @returns {void}
 */
function emitDeprecationWarning(message, codeKey, detail) {
	emitWarning(message, 'DeprecationWarning', DEPRECATION_CODES[codeKey], detail);
}

/**
 * Use this function for experimental warnings, instead of `process.emitWarning()`.
 *
 * @param {string} message
 * @param {keyof typeof EXPERIMENTAL_CODES} codeKey
 * @param {string} detail
 * @returns {void}
 */
function emitExperimentalWarning(message, codeKey, detail) {
	emitWarning(message, 'ExperimentalWarning', EXPERIMENTAL_CODES[codeKey], detail);
}

/**
 * Clear the already emitted warnings.
 * Only useful in tests.
 *
 * @private
 */
function clearEmittedWarnings() {
	if (process.env.NODE_ENV !== 'test') {
		throw new Error('This function can only be called in test environments!');
	}

	emittedWarnings.clear();
}

exports.clearEmittedWarnings = clearEmittedWarnings;
exports.emitDeprecationWarning = emitDeprecationWarning;
exports.emitExperimentalWarning = emitExperimentalWarning;
