'use strict';

const balancedMatch = require('balanced-match');
const valueParser = require('postcss-value-parser');
const validateTypes = require('./validateTypes.cjs');

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
 * @param {(expression: string, expressionIndex: number, funcNode: valueParser.FunctionNode) => void} callback
 * @returns {valueParser.ParsedValue}
 */
function functionArgumentsSearch(source, functionName, callback) {
	return valueParser(source).walk((node) => {
		if (node.type !== 'function') return;

		const { value } = node;

		if (validateTypes.isString(functionName) && value !== functionName) return;

		if (validateTypes.isRegExp(functionName) && !functionName.test(node.value)) return;

		const parensMatch = balancedMatch('(', ')', source.slice(node.sourceIndex));

		validateTypes.assert(parensMatch);

		const expression = parensMatch.body;
		const parenLength = 1; // == '('
		const expressionIndex = node.sourceIndex + value.length + parenLength;

		callback(expression, expressionIndex, node);
	});
}

module.exports = functionArgumentsSearch;