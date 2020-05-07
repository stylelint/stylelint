'use strict';

const formatters = require('./formatters');
const getFormatterOptionsText = require('./utils/getFormatterOptionsText');

function getFormatterFunction(selected) {
	/** @type {Function} */
	let formatterFunction;

	if (typeof selected === 'string') {
		formatterFunction = formatters[selected];

		// TODO: sort this out
		if (formatterFunction === undefined) {
			return new Error(
				`You must use a valid formatter option: ${getFormatterOptionsText()} or a function`,
			);
		}
	} else if (typeof selected === 'function') {
		formatterFunction = selected;
	} else {
		formatterFunction = formatters.json;
	}

	return formatterFunction;
}

module.exports = getFormatterFunction;
