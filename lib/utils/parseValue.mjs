import { parse } from 'css-tree';

/**
 * Parse a value with csstree, with the positions of its nodes
 *
 * @param {string} value
 * @returns {import('css-tree').CssNode | undefined} `undefined` when the value can't be parsed
 */
export default function parseValue(value) {
	try {
		return parse(value, { context: 'value', positions: true });
	} catch (error) {
		if (error instanceof SyntaxError) return undefined;

		throw error;
	}
}
