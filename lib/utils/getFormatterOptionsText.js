'use strict';

const _ = require('lodash');
const formatters = require('../formatters');

/**
 * @param {{ useOr?: boolean }} [options={}]
 * @returns {string}
 */
module.exports = function getFormatterOptionsText(options = {}) {
	let output = _.chain(formatters)
		.keys()
		.map((name) => `"${name}"`)
		.join(', ')
		.value();

	if (options.useOr) {
		output = output.replace(/, ([a-z"]+)$/u, ' or $1');
	}

	return output;
};
