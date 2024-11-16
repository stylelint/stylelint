/**
 * Normalize the fix mode based on options and configuration.
 *
 * @param {import('stylelint').LinterOptions} options
 * @param {import('stylelint').Config | undefined} config
 * @returns {'lax' | 'strict' | undefined}
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
