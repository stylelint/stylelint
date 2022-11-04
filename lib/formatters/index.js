'use strict';

const importLazy = require('import-lazy');

/** @type {typeof import('stylelint').formatters} */
const formatters = {
	compact: importLazy(() => require('./compactFormatter'))(),
	github: importLazy(() => require('./githubFormatter'))(),
	json: importLazy(() => require('./jsonFormatter'))(),
	string: importLazy(() => require('./stringFormatter'))(),
	tap: importLazy(() => require('./tapFormatter'))(),
	unix: importLazy(() => require('./unixFormatter'))(),
	verbose: importLazy(() => require('./verboseFormatter'))(),
};

module.exports = formatters;
