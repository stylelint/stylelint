'use strict';

const isValidHex = require('./isValidHex');

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {boolean}
 */
module.exports = function isHexColor({ type, value }) {
	return type === 'word' && isValidHex(value);
};
