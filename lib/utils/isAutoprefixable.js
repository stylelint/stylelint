'use strict';

const vendor = require('./vendor');

/**
 * Extract each list using the internal API of Autoprefixer 10.2.5.
 *
 * @see https://github.com/postcss/autoprefixer/tree/10.2.5
 *
 * @example
 * const autoprefixer = require('autoprefixer');
 * const Browsers = require('autoprefixer/lib/browsers');
 * const Prefixes = require('autoprefixer/lib/prefixes');
 * const utils = require('autoprefixer/lib/utils');
 *
 * const prefixes = new Prefixes(autoprefixer.data.prefixes, new Browsers(autoprefixer.data.browsers, []));
 */

/**
 * @example
 * Object.keys(prefixes.remove).filter((s) => s.startsWith('@'));
 */
const AT_RULES = new Set([
	'@-khtml-keyframes',
	'@-moz-keyframes',
	'@-ms-keyframes',
	'@-ms-viewport',
	'@-o-keyframes',
	'@-o-viewport',
	'@-webkit-keyframes',
	'@resolution',
]);

/**
 * @example
 * prefixes.remove.selectors.map((s) => s.prefixed);
 */
const SELECTORS = new Set([
	':-moz-any-link',
	':-moz-full-screen',
	':-moz-placeholder',
	':-moz-placeholder-shown',
	':-moz-read-only',
	':-moz-read-write',
	':-ms-fullscreen',
	':-ms-input-placeholder',
	':-webkit-any-link',
	':-webkit-full-screen',
	'::-moz-placeholder',
	'::-moz-selection',
	'::-ms-input-placeholder',
	'::-webkit-backdrop',
	'::-webkit-input-placeholder',
]);

/**
 * @example
 * Object.entries(autoprefixer.data.prefixes)
 *   .filter(([key, value]) => !value.selector && !value.props && !key.startsWith('@'))
 *   .map(([key, value]) => key);
 */
const PROPERTIES = new Set([
	'align-content',
	'align-items',
	'align-self',
	'animation',
	'animation-delay',
	'animation-direction',
	'animation-duration',
	'animation-fill-mode',
	'animation-iteration-count',
	'animation-name',
	'animation-play-state',
	'animation-timing-function',
	'appearance',
	'backdrop-filter',
	'backface-visibility',
	'background-clip',
	'background-origin',
	'background-size',
	'border-block-end',
	'border-block-start',
	'border-bottom-left-radius',
	'border-bottom-right-radius',
	'border-image',
	'border-inline-end',
	'border-inline-start',
	'border-radius',
	'border-top-left-radius',
	'border-top-right-radius',
	'box-decoration-break',
	'box-shadow',
	'box-sizing',
	'break-after',
	'break-before',
	'break-inside',
	'clip-path',
	'color-adjust',
	'column-count',
	'column-fill',
	'column-gap',
	'column-rule',
	'column-rule-color',
	'column-rule-style',
	'column-rule-width',
	'column-span',
	'column-width',
	'columns',
	'filter',
	'flex',
	'flex-basis',
	'flex-direction',
	'flex-flow',
	'flex-grow',
	'flex-shrink',
	'flex-wrap',
	'flow-from',
	'flow-into',
	'font-feature-settings',
	'font-kerning',
	'font-language-override',
	'font-variant-ligatures',
	'grid-area',
	'grid-column',
	'grid-column-align',
	'grid-column-end',
	'grid-column-start',
	'grid-row',
	'grid-row-align',
	'grid-row-end',
	'grid-row-start',
	'grid-template',
	'grid-template-areas',
	'grid-template-columns',
	'grid-template-rows',
	'hyphens',
	'image-rendering',
	'justify-content',
	'margin-block-end',
	'margin-block-start',
	'margin-inline-end',
	'margin-inline-start',
	'mask',
	'mask-border',
	'mask-border-outset',
	'mask-border-repeat',
	'mask-border-slice',
	'mask-border-source',
	'mask-border-width',
	'mask-clip',
	'mask-composite',
	'mask-image',
	'mask-origin',
	'mask-position',
	'mask-repeat',
	'mask-size',
	'object-fit',
	'object-position',
	'order',
	'overscroll-behavior',
	'padding-block-end',
	'padding-block-start',
	'padding-inline-end',
	'padding-inline-start',
	'perspective',
	'perspective-origin',
	'place-self',
	'region-fragment',
	'scroll-snap-coordinate',
	'scroll-snap-destination',
	'scroll-snap-points-x',
	'scroll-snap-points-y',
	'scroll-snap-type',
	'shape-image-threshold',
	'shape-margin',
	'shape-outside',
	'tab-size',
	'text-align-last',
	'text-decoration',
	'text-decoration-color',
	'text-decoration-line',
	'text-decoration-skip',
	'text-decoration-skip-ink',
	'text-decoration-style',
	'text-emphasis',
	'text-emphasis-color',
	'text-emphasis-position',
	'text-emphasis-style',
	'text-orientation',
	'text-overflow',
	'text-size-adjust',
	'text-spacing',
	'touch-action',
	'transform',
	'transform-origin',
	'transform-style',
	'transition',
	'transition-delay',
	'transition-duration',
	'transition-property',
	'transition-timing-function',
	'user-select',
	'writing-mode',
]);

/**
 * @example
 * Object.values(prefixes.remove)
 *   .filter((p) => Array.isArray(p.values))
 *   .flatMap((p) => p.values)
 *   .map((p) => utils.removeNote(p.prefixed)) // normalize '-webkit- old'
 *   .filter((p) => !p.endsWith('-'));         // remove '-webkit-' only
 *
 * @see https://github.com/stylelint/stylelint/pull/5312/files#r636018013
 */
const PROPERTY_VALUES = new Set([
	'-moz-available',
	'-moz-box',
	'-moz-calc',
	'-moz-crisp-edges',
	'-moz-element',
	'-moz-fit-content',
	'-moz-grab',
	'-moz-grabbing',
	'-moz-inline-box',
	'-moz-isolate',
	'-moz-isolate-override',
	'-moz-linear-gradient',
	'-moz-max-content',
	'-moz-min-content',
	'-moz-plaintext',
	'-moz-radial-gradient',
	'-moz-repeating-linear-gradient',
	'-moz-repeating-radial-gradient',
	'-moz-zoom-in',
	'-moz-zoom-out',
	'-ms-flexbox',
	'-ms-grid',
	'-ms-inline-flexbox',
	'-ms-inline-grid',
	'-ms-linear-gradient',
	'-ms-radial-gradient',
	'-ms-repeating-linear-gradient',
	'-ms-repeating-radial-gradient',
	'-o-linear-gradient',
	'-o-pixelated',
	'-o-radial-gradient',
	'-o-repeating-linear-gradient',
	'-o-repeating-radial-gradient',
	'-webkit-box',
	'-webkit-calc',
	'-webkit-cross-fade',
	'-webkit-fill-available',
	'-webkit-filter',
	'-webkit-fit-content',
	'-webkit-flex',
	'-webkit-grab',
	'-webkit-grabbing',
	'-webkit-image-set',
	'-webkit-inline-box',
	'-webkit-inline-flex',
	'-webkit-isolate',
	'-webkit-linear-gradient',
	'-webkit-max-content',
	'-webkit-min-content',
	'-webkit-optimize-contrast',
	'-webkit-radial-gradient',
	'-webkit-repeating-linear-gradient',
	'-webkit-repeating-radial-gradient',
	'-webkit-sticky',
	'-webkit-zoom-in',
	'-webkit-zoom-out',
]);

/**
 * Most identifier types have to be looked up in a unique way,
 * so we're exposing special functions for each.
 */
module.exports = {
	/**
	 * @param {string} identifier
	 * @returns {boolean}
	 */
	atRuleName(identifier) {
		return AT_RULES.has(`@${identifier.toLowerCase()}`);
	},

	/**
	 * @param {string} identifier
	 * @returns {boolean}
	 */
	selector(identifier) {
		return SELECTORS.has(identifier.toLowerCase());
	},

	/**
	 * @param {string} identifier
	 * @returns {boolean}
	 */
	mediaFeatureName(identifier) {
		return identifier.toLowerCase().includes('device-pixel-ratio');
	},

	/**
	 * @param {string} identifier
	 * @returns {boolean}
	 */
	property(identifier) {
		const ident = identifier.toLowerCase();

		// HACK: `interpolation-mode` does not exist. This is an IE extension for `image-rendering`.
		//       See <https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering#examples>
		if (ident === '-ms-interpolation-mode') {
			return true;
		}

		if (vendor.prefix(ident).length === 0) {
			return false;
		}

		return PROPERTIES.has(vendor.unprefixed(ident));
	},

	/**
	 * @param {string} value
	 * @returns {boolean}
	 */
	propertyValue(value) {
		return PROPERTY_VALUES.has(value.toLowerCase());
	},

	/**
	 * @param {string} value
	 * @returns {string}
	 */
	unprefix(value) {
		return value.replace(/-\w+-/, '');
	},
};
