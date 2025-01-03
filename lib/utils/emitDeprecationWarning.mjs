import process from 'node:process';

// Each code must be unique.
const CODES = {
	COMMONJS_PLUGINS: '001',
	COMMONJS_NODEJS_API: '002',
	RESULT_OUTPUT_PROPERTY: '003',
	GITHUB_FORMATTER: '004',
	CONTEXT_FIX: '005',
	RULE: '006', // either removal or renaming
	REPORT_AMBIGUOUS_POSITION: '007',
};

const emittedWarnings = new Set();

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

	const key = JSON.stringify({
		message,
		options: { type: 'DeprecationWarning', code: `stylelint:${code}`, detail },
	});

	if (emittedWarnings.has(key)) return;

	emittedWarnings.add(key);

	process.emitWarning(message, { type: 'DeprecationWarning', code: `stylelint:${code}`, detail });
}

/**
 * Clear the already emitted deprecation warnings.
 * Only useful in tests.
 *
 * @private
 */
export function clearEmittedDeprecationWarnings() {
	emittedWarnings.clear();
}
