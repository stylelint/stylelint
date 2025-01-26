import uniteSets from '../utils/uniteSets.mjs';

export const deprecatedAtKeywords = new Set(['apply', 'document', 'nest', 'viewport']);

// https://www.w3.org/TR/css-nesting-1/#conditionals
export const nestingSupportedAtKeywords = new Set([
	'container',
	'layer',
	'media',
	'scope',
	'starting-style',
	'supports',
]);

// https://www.w3.org/TR/css-page-3/#syntax-page-selector
export const pageMarginAtKeywords = new Set([
	'top-left-corner',
	'top-left',
	'top-center',
	'top-right',
	'top-right-corner',
	'bottom-left-corner',
	'bottom-left',
	'bottom-center',
	'bottom-right',
	'bottom-right-corner',
	'left-top',
	'left-middle',
	'left-bottom',
	'right-top',
	'right-middle',
	'right-bottom',
]);

// https://www.w3.org/TR/css-fonts-4/#font-feature-values-font-feature-value-type
const fontFeatureValueTypes = new Set([
	'annotation',
	'character-variant',
	'historical-forms',
	'ornaments',
	'styleset',
	'stylistic',
	'swash',
]);

// https://developer.mozilla.org/en/docs/Web/CSS/At-rule
export const atKeywords = uniteSets(
	deprecatedAtKeywords,
	nestingSupportedAtKeywords,
	pageMarginAtKeywords,
	fontFeatureValueTypes,
	[
		'counter-style',
		'custom-media',
		'custom-selector',
		'font-face',
		'font-feature-values',
		'font-palette-values',
		'import',
		'keyframes',
		'namespace',
		'page',
		'position-try',
		'property',
		'scroll-timeline',
		'view-transition',
	],
);
