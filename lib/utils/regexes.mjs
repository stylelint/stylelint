import { nestingSupportedAtKeywords } from '../reference/atKeywords.mjs';

export const atRuleRegexes = {
	media: /^media$/i,
	keyframes: /^(-(o|moz|ms|webkit)-)?keyframes$/i,
	property: /^property$/i,
	import: /^import$/i,
	unsupportedNesting: new RegExp(
		`^((?!${[...nestingSupportedAtKeywords.values()].join('|')}).)*$`,
		'i',
	),
};
