/** @import { Config, FixMode, LinterOptions } from 'stylelint' */

/**
 * Normalize the fix mode based on options and configuration.
 *
 * @param {LinterOptions} options
 * @param {Config | undefined} config
 * @returns {FixMode | undefined}
 */
export default function normalizeFixMode(options, config) {
	let fix = options.fix ?? config?.fix;

	if (fix === true || fix === 'lax') {
		return 'lax';
	}

	if (fix === 'strict') {
		return 'strict';
	}

	return undefined;
}
