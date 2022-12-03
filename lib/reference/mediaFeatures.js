'use strict';

const uniteSets = require('../utils/uniteSets.js');

const deprecatedMediaFeatureNames = new Set([
	'device-aspect-ratio',
	'device-height',
	'device-width',
	'max-device-aspect-ratio',
	'max-device-height',
	'max-device-width',
	'min-device-aspect-ratio',
	'min-device-height',
	'min-device-width',
]);

const rangeTypeMediaFeatureNames = new Set([
	'aspect-ratio',
	'color-index',
	'color',
	'height',
	'monochrome',
	'resolution',
	'width',
]);

const mediaFeatureNames = uniteSets(deprecatedMediaFeatureNames, rangeTypeMediaFeatureNames, [
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
	'max-aspect-ratio',
	'max-color',
	'max-color-index',
	'max-height',
	'max-monochrome',
	'max-resolution',
	'max-width',
	'min-aspect-ratio',
	'min-color',
	'min-color-index',
	'min-height',
	'min-monochrome',
	'min-resolution',
	'min-width',
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

module.exports = {
	rangeTypeMediaFeatureNames,
	mediaFeatureNames,
};
