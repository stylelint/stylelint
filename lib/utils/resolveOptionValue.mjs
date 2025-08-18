import getConfigForFile from '../getConfigForFile.mjs';

/** @import {InternalApi, LinterOptions, Config, CosmiconfigResult} from 'stylelint' */

/**
 * Get a value of the specified lint option or configuration.
 *
 * @template T
 * @typedef {object} ResolveOptionValueOptions
 * @property {InternalApi} stylelint
 * @property {keyof LinterOptions & keyof Config} name
 * @property {T} [default]
 */

/**
 * @template T
 * @param {ResolveOptionValueOptions<T>} options
 * @param {CosmiconfigResult} [config]
 * @returns {Promise<T>}
 */
export default async function resolveOptionValue(
	{ stylelint, name, default: defaultValue = undefined },
	config,
) {
	const options = stylelint._options;
	const value = options[name] ?? options.config?.[name];

	if (value != null) {
		return /** @type {T} */ (value);
	}

	const configForFile = config
		? config
		: await getConfigForFile({ stylelint, failIfNoConfig: false });

	return configForFile?.config?.[name] ?? defaultValue;
}
