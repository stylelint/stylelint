import {
	isSimpleBlockNode,
	parseListOfComponentValues,
	stringify,
} from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';
import valueParser from 'postcss-value-parser';

import { assert, isRegExp, isString } from './validateTypes.mjs';

/** @typedef {(expression: string, expressionIndex: number, funcNode: valueParser.FunctionNode, parsedValue: valueParser.ParsedValue) => void} Callback */

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
 * @param {Callback} callback
 * @returns {valueParser.ParsedValue}
 */
export default function functionArgumentsSearch(source, functionName, callback) {
	const parsedValue = valueParser(source);

	return parsedValue.walk((node) => {
		if (node.type !== 'function') return;

		const { value } = node;

		if (isString(functionName) && value !== functionName) return;

		if (isRegExp(functionName) && !functionName.test(node.value)) return;

		const parenLength = 1; // == '('
		const expressionIndex = node.sourceIndex + value.length + parenLength;

		let expression = '';

		if (node.value.toLowerCase() === 'url') {
			// Re-parse url tokens as component values to support interpolation patterns in non-standard CSS
			const [componentValue] = parseListOfComponentValues(
				tokenize({
					// Slice the source value at the opening parenthesis `url(foo) trailing` -> `(foo) trailing`
					// When parsed as a list of component values the first node will be a simple block
					css: source.slice(node.sourceIndex + value.length),
				}),
			);

			assert(isSimpleBlockNode(componentValue));

			expression = stringify([componentValue.value]);
		} else {
			expression = source.slice(expressionIndex, node.sourceEndIndex - 1);
		}

		callback(expression, expressionIndex, node, parsedValue);
	});
}
