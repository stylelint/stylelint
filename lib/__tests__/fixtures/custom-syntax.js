'use strict';

const postcssScss = require('postcss-scss');

module.exports = {
	parse: postcssScss.parse,
	stringify: postcssScss.stringify,
};
