'use strict';

const node_module = require('node:module');
const node_fs = require('node:fs');
const node_path = require('node:path');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
// @ts-expect-error -- TS1343: The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'.
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
