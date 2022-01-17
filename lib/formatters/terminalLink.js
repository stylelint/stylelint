const supportsHyperlinks = require('supports-hyperlinks');

// ANSI escapes
const OSC = '\u001B]';
const BEL = '\u0007';
const SEP = ';';

/**
 * @param {string} text
 * @param {string} url
 * @returns {string}
 */
module.exports = function terminalLink(text, url) {
	if (supportsHyperlinks.stdout) {
		// See https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda
		return [OSC, '8', SEP, SEP, url, BEL, text, OSC, '8', SEP, SEP, BEL].join('');
	}

	return text;
};
