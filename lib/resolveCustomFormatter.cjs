// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const node_module = require('node:module');
const node_fs = require('node:fs');
const node_path = require('node:path');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
const require$1 = node_module.createRequire((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('lib/resolveCustomFormatter.cjs', document.baseURI).href)));

/**
 * @param {string} formatterPath
 * @returns {string}
 */
function resolveCustomFormatter(formatterPath) {
	const resolvedPath = node_path.resolve(formatterPath);

	if (node_fs.existsSync(resolvedPath)) {
		return resolvedPath;
	}

	return require$1.resolve(formatterPath);
}

module.exports = resolveCustomFormatter;
