import { isRegExp, isString } from './utils/validateTypes.mjs';
import validateOptions from './utils/validateOptions.mjs';

/**
 * @typedef {import('stylelint').DisableOptions} DisableOptions
 */

/**
 * Validates that the stylelint config for `result` has a valid disable field
 * named `field`, and returns the result in normalized form.
 *
 * Returns `[]` if no disables should be reported, and automatically reports
 * an invalid configuration.
 *
 * @param {import('stylelint').PostcssResult} result
 * @param {import('stylelint').DisablePropertyName} field
 * @returns {[boolean, Required<DisableOptions>] | []}
 */
export default function validateDisableSettings(result, field) {
	const stylelintResult = result.stylelint;

	// Files with linting errors may not have configs associated with them.
	if (!stylelintResult.config) return [];

	const rawSettings = stylelintResult.config[field];

	/** @type {boolean} */
	let enabled;
	/** @type {DisableOptions} */
	let options;

	if (Array.isArray(rawSettings)) {
		enabled = rawSettings[0];
		options = rawSettings[1] || {};
	} else {
		enabled = rawSettings || false;
		options = {};
	}

	const validOptions = validateOptions(
		result,
		field,
		{
			actual: enabled,
			possible: [true, false],
		},
		{
			actual: options,
			possible: {
				except: [isString, isRegExp],
			},
		},
	);

	if (!validOptions) return [];

	// If the check is disabled with no exceptions, there's no reason to run
	// it at all.
	if (!enabled && !options.except) return [];

	return [
		enabled,
		{
			except: options.except || [],
			severity: options.severity || stylelintResult.config.defaultSeverity || 'error',
		},
	];
}
