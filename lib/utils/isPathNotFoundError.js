'use strict';

const util = require('util');

/**
 * @param {unknown} error
 * @returns {error is NodeJS.ErrnoException}
 */
module.exports = function isPathNotFoundError(error) {
	return util.types.isNativeError(error) && 'code' in error && error.code === 'ENOENT';
};
