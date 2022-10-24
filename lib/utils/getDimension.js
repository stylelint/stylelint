'use strict';

const blurInterpolation = require('./blurInterpolation');
const isStandardSyntaxValue = require('./isStandardSyntaxValue');
const valueParser = require('postcss-value-parser');

/**
 * Get Dimension from value node;
 * `unit` and `number` return null if neither is found
 *
 * @param {import('postcss-value-parser').Node} node
 *
 * @returns {{unit: null, number: null} | valueParser.Dimension}
 */
module.exports = function getDimension(node) {
	if (!node || !node.value) {
		return {
			unit: null,
			number: null,
		};
	}

	// Ignore non-word nodes
	if (node.type !== 'word') {
		return {
			unit: null,
			number: null,
		};
	}

	// Ignore non standard syntax
	if (!isStandardSyntaxValue(node.value)) {
		return {
			unit: null,
			number: null,
		};
	}

	// Ignore HEX
	if (node.value.startsWith('#')) {
		return {
			unit: null,
			number: null,
		};
	}

	// Remove non standard stuff
	const value = blurInterpolation(node.value, '')
		// ignore hack unit
		.replace('\\0', '')
		.replace('\\9', '');

	const parsedUnit = valueParser.unit(value);

	if (!parsedUnit) {
		return {
			unit: null,
			number: null,
		};
	}

	return parsedUnit;
};
