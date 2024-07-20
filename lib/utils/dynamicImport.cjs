// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const path = require('node:path');
const node_url = require('node:url');

/**
 * Dynamic import wrapper for compatibility with absolute paths on Windows
 *
 * @see https://github.com/stylelint/stylelint/issues/7382
 *
 * @param {string} path
 */
function dynamicImport(path$1) {
	return import(path.isAbsolute(path$1) ? node_url.pathToFileURL(path$1).toString() : path$1);
}

module.exports = dynamicImport;
