import matchesStringOrRegExp from './matchesStringOrRegExp.mjs';

/**
 * Check if an options object's propertyName contains a user-defined entry
 * whose key pattern matches inputName and whose value pattern matches inputValue.
 *
 * @param {{ [x: string]: unknown; } | undefined} options
 * @param {string} propertyName
 * @param {unknown} inputName
 * @param {unknown} inputValue
 *
 * @returns {boolean}
 */
export default function optionsMatchesEntry(options, propertyName, inputName, inputValue) {
	if (typeof inputName !== 'string' || typeof inputValue !== 'string') {
		return false;
	}

	const entries = Object.entries(options?.[propertyName] ?? {});
	const matchedEntry = entries.find(([namePattern]) =>
		matchesStringOrRegExp(inputName, namePattern),
	);

	if (!matchedEntry) return false;

	return Boolean(matchesStringOrRegExp(inputValue, matchedEntry[1]));
}
