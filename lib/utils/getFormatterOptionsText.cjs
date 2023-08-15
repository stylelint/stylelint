'use strict';

const index = require('../formatters/index.cjs');

/**
 * @param {string} separator
 * @param {string} [quote]
 * @returns {string}
 */
function getFormatterOptionsText(separator, quote = '') {
	return Object.keys(index)
		.map((name) => `${quote}${name}${quote}`)
		.join(separator);
}

module.exports = getFormatterOptionsText;
