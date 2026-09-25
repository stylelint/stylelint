import { EOL } from 'node:os';

import picocolors from 'picocolors';

import levenshteinDistance from './levenshteinDistance.mjs';

const { cyan, red } = picocolors;

/**
 * @param {string[]} all
 * @param {string} invalid
 * @returns {null|string}
 */
const suggest = (all, invalid) => {
	// NOTE: No suggestion for shortcut options because it's too difficult
	if (invalid.length < 2) {
		return null;
	}

	const maxThreshold = 10;

	for (let threshold = 1; threshold <= maxThreshold; threshold++) {
		const suggestion = all.find((option) => levenshteinDistance(option, invalid) <= threshold);

		if (suggestion) {
			return suggestion;
		}
	}

	return null;
};

/**
 * @param {string} opt
 * @returns {string}
 */
const cliOption = (opt) => {
	if (opt.length === 1) {
		return `"-${opt}"`;
	}

	return `"--${opt}"`;
};

/**
 * @param {string} invalid
 * @param {string|null} suggestion
 * @returns {string}
 */
const buildMessageLine = (invalid, suggestion) => {
	let line = `Invalid option ${red(cliOption(invalid))}.`;

	if (suggestion) {
		line += ` Did you mean ${cyan(cliOption(suggestion))}?`;
	}

	return line + EOL;
};

/**
 * @param {string[]} allowedOptions Option names as typed on the command line, without dashes, e.g. `max-warnings`.
 * @param {string[]} inputOptions
 * @param {Map<string, string>} [replacements] The option to suggest for a removed one, by the removed option's name.
 * @returns {string}
 */
export default function checkInvalidCLIOptions(
	allowedOptions,
	inputOptions,
	replacements = new Map(),
) {
	const allOptions = allowedOptions.toSorted();

	return inputOptions
		.filter((opt) => !allOptions.includes(opt))
		.reduce((msg, invalid) => {
			const suggestion = replacements.get(invalid) ?? suggest(allOptions, invalid);

			return msg + buildMessageLine(invalid, suggestion);
		}, '');
}
