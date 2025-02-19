import { nestingSupportedAtKeywords } from '../reference/atKeywords.mjs';

export const atRuleRegexes = {
	mediaName: /^media$/i,
	keyframesName: /^(-(o|moz|ms|webkit)-)?keyframes$/i,
	propertyName: /^property$/i,
	importName: /^import$/i,
	unsupportedNestingNames: new RegExp(
		`^((?!${[...nestingSupportedAtKeywords.values()].join('|')}).)*$`,
		'i',
	),
};

export const descriptorRegexes = {
	syntaxName: /^syntax$/i,
};
