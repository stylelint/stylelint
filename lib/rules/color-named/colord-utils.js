const { colord, extend } = require('colord');

const namesPlugin = require('colord/plugins/names');
const hwbPlugin = require('colord/plugins/hwb');
const labPlugin = require('colord/plugins/lab');
const lchPlugin = require('colord/plugins/lch');

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

module.exports = {
	colord,
};

/**
 * Parses a valid hwb with comma CSS color function
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hwb()#syntax
 * @param {string} input
 * @returns { { r: number; g: number; b: number; a: number } | null }
 */
function parseHwbWithCommaString(input) {
	const match =
		/^hwb\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:deg|grad|rad|turn)?)\s*,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)%)\s*,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)%)\s*(?:,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)%?)\s*)?\)$/iu.exec(
			input,
		);

	if (!match) {
		return null;
	}

	const [, hue, whiteness, blackness, alpha] = match;

	return colord(`hwb(${hue} ${whiteness} ${blackness}${alpha ? ` / ${alpha}` : ''})`).rgba;
}

/**
 * Parses a valid gray() CSS color function
 * @param {string} input
 * @returns { { r: number; g: number; b: number; a: number } | null }
 */
function parseGrayString(input) {
	const match =
		/^gray\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))%?\s*(?:,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))(%)?\s*)?\)$/iu.exec(
			input,
		);

	if (!match) {
		return null;
	}

	const [, lightness, alpha, alphaUnit] = match;

	return colord({
		l: Number(lightness),
		a: 0,
		b: 0,
		alpha: alpha ? Number(alpha) / (alphaUnit ? 100 : 1) : undefined,
	}).rgba;
}
