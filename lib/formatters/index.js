'use strict';

const importLazy = require('import-lazy');

/** @type {import('stylelint')['formatters']} */
const formatters = {
	compact: importLazy(() => require('./compactFormatter.cjs'))(),
	github: importLazy(() => require('./githubFormatter.cjs'))(),
	json: importLazy(() => require('./jsonFormatter.cjs'))(),
	string: importLazy(() => require('./stringFormatter.cjs'))(),
	tap: importLazy(() => require('./tapFormatter.cjs'))(),
	unix: importLazy(() => require('./unixFormatter.cjs'))(),
	verbose: importLazy(() => require('./verboseFormatter.cjs'))(),
};

module.exports = formatters;
