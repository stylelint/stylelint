import { colord as colord_, extend } from 'colord';
import valueParser from 'postcss-value-parser';

import namesPlugin from 'colord/plugins/names';

import hwbPlugin from 'colord/plugins/hwb';
import labPlugin from 'colord/plugins/lab';
import lchPlugin from 'colord/plugins/lch';

extend([
	// Type definitions are not compatible with commonjs.
	/** @type {any} */ (namesPlugin),
	/** @type {any} */ (hwbPlugin),
	/** @type {any} */ (labPlugin),
	/** @type {any} */ (lchPlugin),

	/* Syntaxes that is removed in Color Module Level 4 specification. */

	// hwb() with comma
	(_colordClass, parsers) => {
		parsers.string.push([parseHwbWithCommaString, /** @type {any} */ ('hwb-with-comma')]);
	},
	// gray()
	(_colordClass, parsers) => {
		parsers.string.push([parseGrayString, /** @type {any} */ ('gray')]);
	},
]);

export const colord = colord_;

/**
 * Parses a valid hwb with comma CSS color function
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hwb()#syntax
 * @param {string} input
 * @returns {import('colord').RgbaColor | null}
 */
function parseHwbWithCommaString(input) {
	input = input.toLowerCase();

	if (!input.startsWith('hwb(') || !input.endsWith(')') || input.includes('/')) {
		return null;
	}

	const [hue, whiteness = '', blackness = '', alpha, ...extraArgs] = input.slice(4, -1).split(',');

	if (!hue || !hue.trim() || !whiteness.trim() || !blackness.trim() || extraArgs.length > 0) {
		return null;
	}

	// Change the delimiter and parse with colord.
	const colordInstance = colord(
		`hwb(${hue} ${whiteness} ${blackness}${alpha ? ` / ${alpha}` : ''})`,
	);

	if (!colordInstance.isValid()) {
		return null;
	}

	return colordInstance.rgba;
}

/**
 * Parses a valid gray() CSS color function
 * @param {string} input
 * @returns {import('colord').RgbaColor | null}
 */
function parseGrayString(input) {
	input = input.toLowerCase();

	if (!input.startsWith('gray(') || !input.endsWith(')')) {
		return null;
	}

	const [lightness, alpha, ...extraArgs] = input.slice(5, -1).split(',');

	if (!lightness || extraArgs.length > 0) {
		return null;
	}

	const lightnessWithUnit = valueParser.unit(lightness.trim());

	if (!lightnessWithUnit || !['', '%'].includes(lightnessWithUnit.unit)) {
		return null;
	}

	/**
	 * @type {import('colord').LabColor | import('colord').LabaColor}
	 */
	let colorObject = {
		l: Number(lightnessWithUnit.number),
		a: 0,
		b: 0,
	};

	if (alpha) {
		const alphaWithUnit = valueParser.unit(alpha.trim());

		if (!alphaWithUnit || !['', '%'].includes(alphaWithUnit.unit)) {
			return null;
		}

		colorObject = {
			...colorObject,
			alpha: Number(alphaWithUnit.number) / (alphaWithUnit.unit ? 100 : 1),
		};
	}

	return colord(colorObject).rgba;
}
