'use strict';

const importLazy = require('import-lazy');

/** @type {typeof import('stylelint').formatters} */
const formatters = {
	compact: importLazy(() => require('./compactFormatter'))('compactFormatter'),
	json: importLazy(() => require('./jsonFormatter'))('jsonFormatter'),
	string: importLazy(() => require('./stringFormatter'))('stringFormatter'),
	tap: importLazy(() => require('./tapFormatter'))('tapFormatter'),
	unix: importLazy(() => require('./unixFormatter'))('unixFormatter'),
	verbose: importLazy(() => require('./verboseFormatter'))('verboseFormatter'),
};

module.exports = formatters;
