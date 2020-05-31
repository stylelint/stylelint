'use strict';

const importLazy = require('import-lazy');

module.exports = {
	compact: importLazy(() => require('./compactFormatter'))(),
	json: importLazy(() => require('./jsonFormatter'))(),
	string: importLazy(() => require('./stringFormatter'))(),
	unix: importLazy(() => require('./unixFormatter'))(),
	verbose: importLazy(() => require('./verboseFormatter'))(),
};
