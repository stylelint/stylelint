/** @import { FixMode, LinterOptions } from 'stylelint' */

/**
 * Normalize the fix mode based on options and configuration.
 *
 * @param {LinterOptions} options
 * @returns {FixMode | undefined}
 */
export default function normalizeFixMode(options) {
	let fix = options.fix;

	if (fix === true || fix === 'lax') {
		return 'lax';
	}

	if (fix === 'strict') {
		return 'strict';
	}

	return undefined;
}
