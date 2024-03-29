// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const prefixes = require('../reference/prefixes.cjs');

const HAS_PREFIX_REGEX = new RegExp(`(?:${[...prefixes.prefixes].join('|')})`, 'i');

/**
 * Check if a string contains any prefix
 *
 * @param {string} string
 * @returns {boolean}
 */
function hasPrefix(string) {
	return HAS_PREFIX_REGEX.test(string);
}

module.exports = hasPrefix;
