'use strict';

const merge = require('deepmerge');

/**
 * @param {...object} args
 * @returns {object}
 */
module.exports = function mergeTestDescriptions(...args) {
	return merge.all(args);
};
