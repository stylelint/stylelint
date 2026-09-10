import { isBoolean, isPlainObject } from './validateTypes.mjs';
import { ConfigurationError } from './errors.mjs';

/**
 * Validate the `globOptions` linter option. Only the documented options are
 * accepted, so the glob library stays an implementation detail.
 *
 * @param {unknown} globOptions
 * @returns {void}
 */
export default function validateGlobOptions(globOptions) {
	if (globOptions === undefined) return;

	if (!isPlainObject(globOptions)) {
		throw new ConfigurationError(
			`Invalid globOptions configuration: expected an object. Got "${globOptions}".`,
		);
	}

	const { dot, ...unknownOptions } = globOptions;
	const [unknownName] = Object.keys(unknownOptions);

	if (unknownName) {
		throw new ConfigurationError(
			`Invalid globOptions configuration: unknown option "${unknownName}". Supported options: "dot".`,
		);
	}

	if ('dot' in globOptions && !isBoolean(dot)) {
		throw new ConfigurationError(
			`Invalid globOptions configuration: "dot" must be a boolean. Got "${dot}".`,
		);
	}
}
