import getConfigForFile from '../getConfigForFile.mjs';

/** @import {InternalApi, LinterOptions, Config} from 'stylelint' */

/**
 * Get a value of the specified lint option or configuration.
 *
 * @template T
 * @param {Object} options
 * @param {InternalApi} options.stylelint
 * @param {keyof LinterOptions} options.option
 * @param {keyof Config} options.config
 * @param {T} [options.default]
 * @returns {Promise<T>}
 */
export default async function resolveOptionValue({
	stylelint,
	option,
	config,
	default: defaultValue = undefined,
}) {
	const options = stylelint._options;
	const value = options[option] ?? options.config?.[config];

	if (value != null) {
		return /** @type {T} */ (value);
	}

	const configForFile = await getConfigForFile({ stylelint, failIfNoConfig: false });

	return configForFile?.config?.[config] ?? defaultValue;
}
