'use strict';

const _importLazy = require('import-lazy');

const importLazy = _importLazy(require);

/** @type {typeof import('stylelint').formatters} */
const formatters = {
	compact: importLazy('./compactFormatter'),
	github: importLazy('./githubFormatter'),
	json: importLazy('./jsonFormatter'),
	string: importLazy('./stringFormatter'),
	tap: importLazy('./tapFormatter'),
	unix: importLazy('./unixFormatter'),
	verbose: importLazy('./verboseFormatter'),
};

module.exports = formatters;
