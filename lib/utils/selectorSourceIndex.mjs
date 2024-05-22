/**
 * Get the source index of a selector, excluding leading whitespace.
 *
 * @typedef {import('postcss-selector-parser').Container<string | undefined>} Container
 * @param {Container} node
 *
 * @returns {number}
 */
export default function selectorSourceIndex(node) {
	// The first child node sourceIndex is the same as the parent sourceIndex without leading whitespace
	// If the node doesn't have any children, use the node sourceIndex instead
	return node.first?.sourceIndex ?? node.sourceIndex;
}
