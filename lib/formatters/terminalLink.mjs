import process from 'node:process';

// ANSI escapes
const OSC = '\u001B]';
const BEL = '\u0007';

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
	if (!process.stdout.isTTY) return false;

	if ('CI' in process.env) return false;

	if (process.platform === 'win32') return 'WT_SESSION' in process.env;

	return process.env.TERM !== 'dumb';
}
