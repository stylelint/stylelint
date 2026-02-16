import {
	aNPlusBNotationPseudoClasses,
	aNPlusBOfSNotationPseudoClasses,
} from '../reference/selectors.mjs';
import { colorFunctions, mathFunctions } from '../reference/functions.mjs';
import { deprecatedMediaTypesNames } from '../reference/mediaTypes.mjs';
import { lengthUnits } from '../reference/units.mjs';
import { namedColorsKeywords } from '../reference/keywords.mjs';
import { nestingSupportedAtKeywords } from '../reference/atKeywords.mjs';
import { prefixes } from '../reference/prefixes.mjs';

const aNPlusBClasses = [
	...aNPlusBNotationPseudoClasses.values(),
	...aNPlusBOfSNotationPseudoClasses.values(),
].join('|');

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

export const propertyRegexes = {
	containerNameAndShorthandName: /^container(-name)?$/i,
	custom: /^--/,
	fontFamilyAndShorthandName: /^font(-family)?$/i,
	fontWeightAndShorthandName: /^font(-weight)?$/i,
	gridAreaNames: /^(?:grid|grid-template|grid-template-areas)$/i,
};

export const mayIncludeRegexes = {
	aNPlusBNotationPseudoClass: new RegExp(`\\b:(?:${aNPlusBClasses})\\(`, 'i'),
	annotation: /!/,
	attributeSelector: /\[/,
	attributeSelectorWithOperator: /\[.*=/,
	classSelector: /\./,
	colorFunction: new RegExp(`\\b(?:${[...colorFunctions.values()].join('|')})\\(`, 'i'),
	combinator: /[>+~\s]/,
	customProperty: /--/,
	deprecatedMediaType: new RegExp(
		`\\b(?:${[...deprecatedMediaTypesNames].join('|')})\\b`,
		'i',
	),
	dimension: /\d[%\w-]/,
	grayFunction: /\bgray\(/i,
	hexColor: /#[\da-z]+/i,
	idClassAttributeSelector: /[#.[]/,
	idSelector: /#/,
	keyword: /(?<![0-9])[a-z]+(?!\()/i,
	layerFunction: /\blayer\(/i,
	mathFunction: new RegExp(`\\b(?:${[...mathFunctions.values()].join('|')})\\(`, 'i'),
	multipleValues: /\s|,/,
	namedColor: new RegExp(`\\b(?:${[...namedColorsKeywords.values()].join('|')})\\b`, 'i'),
	nestingSelector: /&/,
	notPseudoClass: /:not\(/i,
	operator: /[+-]/,
	prefix: new RegExp(`(?:${[...prefixes].join('|')})`, 'i'),
	pseudo: /:/,
	pseudoElement: /::/,
	time: /\dm?s/i,
	typeSelector: /(?:[^.#[:a-z-]|^)[a-z]/i,
	universalSelector: /\*/,
	urlFunction: /\burl\(/i,
	validHex: /#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})(?:$|[^\da-f])/i,
	varFunction: /\bvar\(/i,
	zeroLength: new RegExp(
		`\\b[+-]?(?:0+|0*\\.\\d+)(?:${[...lengthUnits.values()].join('|')})\\b`,
		'i',
	),
};
