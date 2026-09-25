import { ConfigurationError } from './errors.mjs';
import { isPlainObject } from './validateTypes.mjs';

const supportedOptions = new Set([
	'braceExpansion',
	'caseSensitiveMatch',
	'dot',
	'extglob',
	'followSymbolicLinks',
	'ignore',
]);

/**
 * Validate the `globbyOptions` linter option. Only a subset of globby's options
 * is supported, and any other option throws rather than being silently ignored.
 *
 * @param {unknown} globbyOptions
 * @returns {void}
 */
export default function validateGlobbyOptions(globbyOptions) {
	if (globbyOptions === undefined) return;

	if (!isPlainObject(globbyOptions)) {
		throw new ConfigurationError(
			`Invalid globbyOptions configuration: expected an object. Got "${globbyOptions}".`,
		);
	}

	const unknownOption = Object.keys(globbyOptions).find((name) => !supportedOptions.has(name));

	if (unknownOption) {
		const names = [...supportedOptions].map((name) => `"${name}"`).join(', ');

		throw new ConfigurationError(
			`Invalid globbyOptions configuration: unknown option "${unknownOption}". Supported options: ${names}.`,
		);
	}
}
