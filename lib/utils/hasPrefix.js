'use strict';

const { prefixes } = require('../reference/prefixes');

const HAS_PREFIX_REGEX = new RegExp(`(?:${[...prefixes].join('|')})`, 'i');

/**
 * Check if a string contains any prefix
 *
 * @param {string} string
 * @returns {boolean}
 */
module.exports = function hasPrefix(string) {
	return HAS_PREFIX_REGEX.test(string);
};
