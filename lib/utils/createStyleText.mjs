import { styleText } from 'node:util';

import isColorSupported from './isColorSupported.mjs';

/**
 * @typedef {Parameters<typeof styleText>[0]} Format
 * @typedef {(format: Format, text: string) => string} StyleText
 */

/**
 * @param {boolean} [color]
 * @returns {StyleText}
 */
export default function createStyleText(color = isColorSupported()) {
	if (!color) {
		return (_format, text) => text;
	}

	// `color` is already decided, so skip the per-call stream check.
	return (format, text) => styleText(format, text, { validateStream: false });
}
