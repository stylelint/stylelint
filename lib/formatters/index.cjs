'use strict';

const node_module = require('node:module');
const importLazy = require('import-lazy');

// @ts-expect-error -- TS1343: The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'.
const require$1 = node_module.createRequire((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (document.currentScript && document.currentScript.src || new URL('lib/formatters/index.cjs', document.baseURI).href)));

/** @type {import('stylelint')['formatters']} */
const formatters = {
	compact: importLazy(() => require$1('./compactFormatter.cjs'))(),
	github: importLazy(() => require$1('./githubFormatter.cjs'))(),
	json: importLazy(() => require$1('./jsonFormatter.cjs'))(),
	string: importLazy(() => require$1('./stringFormatter.cjs'))(),
	tap: importLazy(() => require$1('./tapFormatter.cjs'))(),
	unix: importLazy(() => require$1('./unixFormatter.cjs'))(),
	verbose: importLazy(() => require$1('./verboseFormatter.cjs'))(),
};

module.exports = formatters;
