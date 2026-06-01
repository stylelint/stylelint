import { isValueFunction, isValueWord } from './typeGuards.mjs';
import isStandardSyntaxFunction from './isStandardSyntaxFunction.mjs';

/**
 * Check whether a function is standard syntax color function
 *
 * @param {import('postcss-value-parser').FunctionNode} node
 * @returns {boolean}
 */
export default function isStandardSyntaxColorFunction(node) {
	if (!isStandardSyntaxFunction(node)) return false;

	// scss can accept a #hex, or $var variables and we need to check all nested fn nodes
	for (const fnNode of node.nodes) {
		if (isValueFunction(fnNode)) return isStandardSyntaxColorFunction(fnNode);

		if (
			isValueWord(fnNode) &&
			(fnNode.value.startsWith('#') || fnNode.value.startsWith('$') || fnNode.value.includes('.$'))
		)
			return false;
	}

	return true;
}
