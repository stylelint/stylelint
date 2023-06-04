'use strict';

const uniteSets = require('../utils/uniteSets.js');

const deprecatedMediaFeatureNames = new Set([
	'device-aspect-ratio',
	'device-height',
	'device-width',
]);

const rangeTypeMediaFeatureNames = uniteSets(deprecatedMediaFeatureNames, [
	'aspect-ratio',
	'color',
	'color-index',
	'height',
	'horizontal-viewport-segments',
	'monochrome',
	'resolution',
	'vertical-viewport-segments',
	'width',
]);

const rangeTypeMediaFeatureNamesWithMinMaxPrefix = new Set(
	[...rangeTypeMediaFeatureNames].flatMap((name) => {
		return [`min-${name}`, `max-${name}`];
	}),
);

const discreteTypeMediaFeatureNames = new Set([
	'any-hover',
	'any-pointer',
	'color-gamut',
	'display-mode',
	'dynamic-range',
	'forced-colors',
	'grid',
	'hover',
	'inverted-colors',
	'light-level',
	'orientation',
	'overflow-block',
	'overflow-inline',
	'pointer',
	'prefers-color-scheme',
	'prefers-contrast',
	'prefers-reduced-motion',
	'prefers-reduced-transparency',
	'scan',
	'scripting',
	'update',
	'video-dynamic-range',
]);

const mediaFeatureNames = uniteSets(
	deprecatedMediaFeatureNames,
	rangeTypeMediaFeatureNames,
	rangeTypeMediaFeatureNamesWithMinMaxPrefix,
	discreteTypeMediaFeatureNames,
);

const mediaFeatureNameAllowedValueKeywords = new Map([
	['any-hover', ['none', 'hover']],
	['any-pointer', ['none', 'coarse', 'fine']],
	['color-gamut', ['srgb', 'p3', 'rec2020']],
	['display-mode', ['fullscreen', 'standalone', 'minimal-ui', 'browser']],
	['dynamic-range', ['standard', 'high']],
	['environment-blending', ['opaque', 'additive', 'subtractive']],
	['forced-colors', ['none', 'active']],
	['hover', ['none', 'hover']],
	['inverted-colors', ['none', 'inverted']],
	['nav-controls', ['none', 'back']],
	['orientation', ['portrait', 'landscape']],
	['overflow-block', ['none', 'scroll', 'paged']],
	['overflow-inline', ['none', 'scroll']],
	['pointer', ['none', 'coarse', 'fine']],
	['prefers-color-scheme', ['light', 'dark']],
	['prefers-contrast', ['no-preference', 'less', 'more', 'custom']],
	['prefers-reduced-data', ['no-preference', 'reduce']],
	['prefers-reduced-motion', ['no-preference', 'reduce']],
	['prefers-reduced-transparency', ['no-preference', 'reduce']],
	['resolution', ['infinite']],
	['scan', ['interlace', 'progressive']],
	['scripting', ['none', 'initial-only', 'enabled']],
	['update', ['none', 'slow', 'fast']],
	['video-color-gamut', ['srgb', 'p3', 'rec2020']],
	['video-dynamic-range', ['standard', 'high']],
]);

const mediaFeatureNameAllowedValueTypes = new Map([
	['aspect-ratio', 'ratio'],
	['color', 'integer'],
	['color-index', 'integer'],
	['device-aspect-ratio', 'ratio'],
	['device-height', 'length'],
	['device-width', 'length'],
	['height', 'length'],
	['horizontal-viewport-segments', 'integer'],
	['monochrome', 'integer'],
	['resolution', 'resolution'],
	['vertical-viewport-segments', 'integer'],
	['width', 'length'],
]);

module.exports = {
	mediaFeatureNameAllowedValueKeywords,
	mediaFeatureNameAllowedValueTypes,
	mediaFeatureNames,
	rangeTypeMediaFeatureNames,
	rangeTypeMediaFeatureNamesWithMinMaxPrefix,
};
