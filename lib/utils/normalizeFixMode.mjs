/** @import { FixMode } from 'stylelint' */

/**
 * Normalize the fix mode based on options and configuration.
 *
 * @param {unknown} fix
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
