/** @import { FixMode, LinterOptions } from 'stylelint' */

/**
 * Normalize the fix mode based on options and configuration.
 *
 * @param {boolean | FixMode | undefined} fix
 * @returns {FixMode | undefined}
 */
export default function normalizeFixMode(fix) {
	if (fix === true || fix === 'lax') {
		return 'lax';
	}

	if (fix === 'strict') {
		return 'strict';
	}

	return undefined;
}
