'use strict';

const MurmurHash3 = require('imurmurhash');

/**
 * hash the given string
 * @param  {string} str the string to hash
 * @returns {string} the hash
 */
function hash(str) {
	return MurmurHash3(str).result().toString(36);
}

module.exports = hash;
