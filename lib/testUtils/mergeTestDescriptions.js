'use strict';

const merge = require('deepmerge');

module.exports = function (...args) {
	return merge.all(args);
};
