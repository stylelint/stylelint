'use strict';

// Use this require pattern so that syntaxes can be bundled separately
const importLazy = require('import-lazy')(require);

/** @typedef {import('../getPostcssResult').Syntax} Syntax */
module.exports = {
	/** @type {(config?: {unstable_substitute?: boolean}) => Syntax} */
	'css-in-js': importLazy('./syntax-css-in-js'),
	/** @type Syntax */
	html: importLazy('./syntax-html'),
	/** @type Syntax */
	less: importLazy('./syntax-less'),
	/** @type Syntax */
	markdown: importLazy('./syntax-markdown'),
	/** @type Syntax */
	sass: importLazy('./syntax-sass'),
	/** @type Syntax */
	scss: importLazy('./syntax-scss'),
	/** @type Syntax */
	sugarss: importLazy('./syntax-sugarss'),
};
