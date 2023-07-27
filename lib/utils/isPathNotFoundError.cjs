'use strict';

const node_util = require('node:util');

/**
 * @param {unknown} error
 * @returns {error is NodeJS.ErrnoException}
 */
function isPathNotFoundError(error) {
	return node_util.types.isNativeError(error) && 'code' in error && error.code === 'ENOENT';
}

module.exports = isPathNotFoundError;
