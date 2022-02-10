'use strict';

const balancedMatch = require('balanced-match');
const valueParser = require('postcss-value-parser');

const { assert, isString, isRegExp } = require('./validateTypes');

/**
 * Search a CSS string for functions by name.
 * For every match, invoke the callback, passing the function's
 * "argument(s) string" (whatever is inside the parentheses)
 * as an argument.
 *
 * Callback will be called once for every matching function found,
 * with the function's "argument(s) string" and its starting index
 * as the arguments.
 *
 * @param {string} source
 * @param {string | RegExp} functionName
 * @param {(expression: string, expressionIndex: number) => void} callback
 * @returns {void}
 */
module.exports = function functionArgumentsSearch(source, functionName, callback) {
	valueParser(source).walk((node) => {
		if (node.type !== 'function') return;

		const { value } = node;

		if (isString(functionName) && value !== functionName) return;

		if (isRegExp(functionName) && !functionName.test(node.value)) return;

		const parensMatch = balancedMatch('(', ')', source.slice(node.sourceIndex));

		assert(parensMatch);

		const expression = parensMatch.body;
		const parenLength = 1; // == '('
		const expressionIndex = node.sourceIndex + value.length + parenLength;

		callback(expression, expressionIndex);
	});
};
