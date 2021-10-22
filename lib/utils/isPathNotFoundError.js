'use strict';

const util = require('util');

/**
 * @param {unknown} error
 * @returns {error is NodeJS.ErrnoException}
 */
module.exports = function isPathNotFoundError(error) {
	// @ts-expect-error -- TS2339: Property 'code' does not exist on type 'Error'.
	return util.types.isNativeError(error) && error.code === 'ENOENT';
};
