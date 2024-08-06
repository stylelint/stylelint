import process from 'node:process';

// Each code must be unique.
const CODES = {
	COMMONJS_PLUGINS: '001',
	COMMONJS_NODEJS_API: '002',
	RESULT_OUTPUT_PROPERTY: '003',
	GITHUB_FORMATTER: '004',
	CONTEXT_FIX: '005',
};

/**
 * Use this function for deprecation warnings, instead of `process.emitWarning()`.
 *
 * @param {string} message
 * @param {keyof CODES} codeKey
 * @param {string} detail
 * @returns {void}
 */
export default function emitDeprecationWarning(message, codeKey, detail) {
	const code = CODES[codeKey];

	process.emitWarning(message, { type: 'DeprecationWarning', code: `stylelint:${code}`, detail });
}
