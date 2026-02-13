import { nestingSupportedAtKeywords } from '../reference/atKeywords.mjs';

export const atRuleRegexes = {
	containerName: /^container$/i,
	customMediaName: /^custom-media$/i,
	importName: /^import$/i,
	keyframesName: /^(-(o|moz|ms|webkit)-)?keyframes$/i,
	layerName: /^layer$/i,
	mediaName: /^media$/i,
	pageName: /^page$/i,
	propertyName: /^property$/i,
	scopeName: /^scope$/i,
	unsupportedNestingNames: new RegExp(
		`^((?!${[...nestingSupportedAtKeywords.values()].join('|')}).)*$`,
		'i',
	),
};

export const descriptorRegexes = {
	syntaxName: /^syntax$/i,
};

export const functionRegexes = {
	layer: /layer\((.*?)\)/i,
};

export const propertyRegexes = {
	containerNameAndShorthandName: /^container(-name)?$/i,
	custom: /^--/,
	fontFamilyAndShorthandName: /^font(-family)?$/i,
	fontWeightAndShorthandName: /^font(-weight)?$/i,
	gridAreaNames: /^(?:grid|grid-template|grid-template-areas)$/i,
};

export const mayIncludeRegexes = {
	annotation: /!/,
	attributeSelector: /\[/,
	attributeSelectorWithOperator: /\[.*=/,
	classSelector: /\./,
	combinator: /[>+~\s]/,
	customProperty: /--/,
	idSelector: /#/,
	nestingSelector: /&/,
	notPseudoClass: /:not\(/i,
	pseudo: /:/,
	pseudoElement: /::/,
	typeSelector: /(?:[^.#[:a-z-]|^)[a-z]/i,
	universalSelector: /\*/,
};
