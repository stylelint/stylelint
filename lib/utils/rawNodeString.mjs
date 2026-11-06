/**
 * Stringify PostCSS node including its raw "before" string.
 *
 * @param {import('postcss').Node} node
 *
 * @returns {string}
 */
export default function rawNodeString(node) {
	return (node.raws.before ?? '') + node.toString();
}
