'use strict';

const { fileURLToPath } = require('node:url');

/**
 * @param {string | URL} path
 * @returns {string}
 */
module.exports = function replaceBackslashes(path) {
	return (typeof path === 'string' ? path : fileURLToPath(path)).replace(/\\/g, '/');
};
