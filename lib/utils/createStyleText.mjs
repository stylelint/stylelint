import { styleText } from 'node:util';

/**
 * @typedef {Parameters<typeof styleText>[0]} Format
 * @typedef {(format: Format, text: string) => string} StyleText
 */

/**
 * @param {boolean} [color]
 * @returns {StyleText}
 */
export default function createStyleText(color) {
	if (color === false) {
		return (_format, text) => text;
	}

	// Force color when it's on, otherwise let Node.js detect whether the terminal supports it
	return (format, text) => styleText(format, text, { validateStream: color !== true });
}
