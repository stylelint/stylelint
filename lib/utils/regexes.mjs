import {
	aNPlusBNotationPseudoClasses,
	aNPlusBOfSNotationPseudoClasses,
	percentageKeyframeWithNamedEquivalent,
} from '../reference/selectors.mjs';
import {
	colorFunctions,
	hueColorFunctions,
	legacyNotationColorFunctions,
	lightnessColorFunctions,
	mathFunctions,
	withAlphaAliasColorFunctions,
	withoutAlphaAliasColorFunctions,
} from '../reference/functions.mjs';
import {
	displayInsideKeywords,
	displayLegacyKeywords,
	displayListItemKeyword,
	displayOutsideKeywords,
	fontWeightNonNumericKeywords,
	fontWeightNumericKeywordsWithNamedEquivalent,
	fontWeightRelativeKeywords,
	keyframeSelectorKeywords,
	namedColorsKeywords,
} from '../reference/keywords.mjs';
import { deprecatedMediaTypesNames } from '../reference/mediaTypes.mjs';
import { lengthUnits } from '../reference/units.mjs';
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
	legacyNotationColorFunction: new RegExp(
		`\\b(?:${[...legacyNotationColorFunctions.values()].join('|')})\\(`,
		'i',
	),
	combinator: /[>+~\s]/,
	customProperty: /--/,
	deprecatedMediaType: new RegExp(`\\b(?:${[...deprecatedMediaTypesNames].join('|')})\\b`, 'i'),
	displayKeyword: new RegExp(
		`\\b(?:${[...displayListItemKeyword, ...displayOutsideKeywords, ...displayInsideKeywords, ...displayLegacyKeywords].join('|')})\\b`,
		'i',
	),
	dimension: /\d[%\w-]/,
	grayFunction: /\bgray\(/i,
	hexColor: /#[\da-z]+/i,
	hueColorFunction: new RegExp(`\\b(?:${[...hueColorFunctions.values()].join('|')})\\(`, 'i'),
	lightnessColorFunction: new RegExp(
		`\\b(?:${[...lightnessColorFunctions.values()].join('|')})\\(`,
		'i',
	),
	idClassAttributeSelector: /[#.[]/,
	idSelector: /#/,
	keyword: /(?<![0-9])[a-z]+(?!\()/i,
	layerFunction: /\blayer\(/i,
	mathFunction: new RegExp(`\\b(?:${[...mathFunctions.values()].join('|')})\\(`, 'i'),
	namedFontWeight: new RegExp(
		`\\b(?:${[...new Set([...fontWeightNonNumericKeywords, ...fontWeightRelativeKeywords])].join('|')})\\b`,
		'i',
	),
	numericFontWeight: new RegExp(
		`\\b(?:${[...fontWeightNumericKeywordsWithNamedEquivalent.values()].join('|')})\\b`,
	),
	namedKeyframeSelectorWithPercentageEquivalent: new RegExp(
		`\\b(?:${[...keyframeSelectorKeywords.values()].join('|')})\\b`,
		'i',
	),
	percentageKeyframeSelectorWithNamedEquivalent: new RegExp(
		`(?:^|[,\\s])(?:${[...percentageKeyframeWithNamedEquivalent.values()].join('|')})`,
	),
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
	withAlphaAliasColorFunction: new RegExp(
		`\\b(?:${[...withAlphaAliasColorFunctions.values()].join('|')})\\(`,
		'i',
	),
	withoutAlphaAliasColorFunction: new RegExp(
		`\\b(?:${[...withoutAlphaAliasColorFunctions.values()].join('|')})\\(`,
		'i',
	),
	zeroLength: new RegExp(
		`\\b[+-]?(?:0+|0*\\.\\d+)(?:${[...lengthUnits.values()].join('|')})\\b`,
		'i',
	),
};
