'use strict';

const uniteSets = require('../utils/uniteSets.js');

// https://www.w3.org/TR/css-page-3/#syntax-page-selector
const pageMarginAtKeywords = new Set([
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

// https://developer.mozilla.org/en/docs/Web/CSS/At-rule
const atKeywords = uniteSets(pageMarginAtKeywords, [
	'annotation',
	'apply',
	'character-variant',
	'charset',
	'container',
	'counter-style',
	'custom-media',
	'custom-selector',
	'document',
	'font-face',
	'font-feature-values',
	'import',
	'keyframes',
	'layer',
	'media',
	'namespace',
	'nest',
	'ornaments',
	'page',
	'property',
	'scroll-timeline',
	'styleset',
	'stylistic',
	'supports',
	'swash',
	'viewport',
]);

module.exports = {
	atKeywords,
};
