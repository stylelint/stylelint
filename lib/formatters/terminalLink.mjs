import process from 'node:process';

// ANSI escapes
const OSC = '\u001B]';
const BEL = '\u0007';

// Align with Node.js's `FORCE_COLOR`
const TRUE_VALUES = new Set(['', '1', 'true']);

/**
 * @see https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda
 *
 * @param {string} text
 * @param {string} url
 * @returns {string}
 */
export default function terminalLink(text, url) {
	if (isHyperlinkSupported()) {
		return `${OSC}8;;${url}${BEL}${text}${OSC}8;;${BEL}`;
	}

	return text;
}

/**
 * @returns {boolean}
 */
function isHyperlinkSupported() {
	const { FORCE_HYPERLINK, TERM } = process.env;

	if (FORCE_HYPERLINK !== undefined) return TRUE_VALUES.has(FORCE_HYPERLINK);

	if (!process.stdout.isTTY) return false;

	return TERM !== 'dumb';
}
