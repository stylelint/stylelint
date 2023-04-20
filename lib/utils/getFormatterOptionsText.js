'use strict';

const formatters = require('../formatters');

/**
 * @param {string} separator
 * @param {string} [quote]
 * @returns {string}
 */
module.exports = function getFormatterOptionsText(separator, quote = '') {
	return Object.keys(formatters)
		.map((name) => `${quote}${name}${quote}`)
		.join(separator);
};
