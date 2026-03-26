import matchesStringOrRegExp from './matchesStringOrRegExp.mjs';

/**
 * Check if an options object's propertyName contains a user-defined entry
 * whose key pattern matches inputName and whose value pattern matches inputValue.
 *
 * @param {Record<string, unknown> | undefined} options
 * @param {string} propertyName
 * @param {string} inputName
 * @param {string} inputValue
 *
 * @returns {boolean}
 */
export default function optionsMatchesEntry(options, propertyName, inputName, inputValue) {
	if (!options) return false;

	const propertyValue = options[propertyName];

	if (!propertyValue) return false;

	const entries = Object.entries(propertyValue);
	const matchedEntry = entries.find(([namePattern]) =>
		matchesStringOrRegExp(inputName, namePattern),
	);

	if (!matchedEntry) return false;

	return Boolean(matchesStringOrRegExp(inputValue, matchedEntry[1]));
}
