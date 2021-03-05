'use strict';

const _ = require('lodash');

/** @typedef {import('postcss').Declaration} Declaration */

/**
 * @param {Declaration} decl
 * @param {string} value
 * @returns {Declaration} The declaration that was passed in.
 */
module.exports = function getDeclarationValue(decl, value) {
	if (_.has(decl, 'raws.value')) {
		_.set(decl, 'raws.value.raw', value);
	} else {
		decl.value = value;
	}

	return decl;
};
