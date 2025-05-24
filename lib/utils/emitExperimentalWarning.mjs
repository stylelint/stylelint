import process from 'node:process';

// Each code must be unique across all warning types (ExperimentalWarning, DeprecationWarning, etc.).
// To avoid conflicts, we start experimental warning codes from 1001.
const CODES = {
	SUPPRESSIONS: '1001',
};

const emittedWarnings = new Set();

/**
 * Use this function for experimental warnings, instead of `process.emitWarning()`.
 *
 * @param {string} message
 * @param {keyof CODES} codeKey
 * @param {string} detail
 * @returns {void}
 */
export default function emitExperimentalWarning(message, codeKey, detail) {
	const code = CODES[codeKey];

	const key = JSON.stringify({
		message,
		options: { type: 'ExperimentalWarning', code: `stylelint:${code}`, detail },
	});

	if (emittedWarnings.has(key)) return;

	emittedWarnings.add(key);

	process.emitWarning(message, { type: 'ExperimentalWarning', code: `stylelint:${code}`, detail });
}

/**
 * Clear the already emitted experimental warnings.
 * Only useful in tests.
 *
 * @private
 */
export function clearEmittedExperimentalWarnings() {
	emittedWarnings.clear();
}
