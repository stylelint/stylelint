'use strict';

const isValidHex = require('./isValidHex.cjs');

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {boolean}
 */
function isHexColor({ type, value }) {
	return type === 'word' && isValidHex(value);
}

module.exports = isHexColor;
