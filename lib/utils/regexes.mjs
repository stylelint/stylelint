import { nestingSupportedAtKeywords } from '../reference/atKeywords.mjs';

export const atRulesRegexes = {
	media: /^media$/i,
	keyframes: /^(-(o|moz|ms|webkit)-)?keyframes$/i,
	property: /^property$/i,
	unsupportedNesting: new RegExp(
		`^((?!${[...nestingSupportedAtKeywords.values()].join('|')}).)*$`,
		'i',
	),
};
