import selectorParser from 'postcss-selector-parser';

const SELECTOR_CONTAINING_PSEUDO_CLASSES = new Set(
	['is', 'matches', 'not', 'where', 'host'].map((s) => `:${s}`),
);

/**
 * @param {unknown} node
 * @returns {node is selectorParser.Pseudo}
 */
export default function isSelectorContainingPseudoClass(node) {
	return (
		selectorParser.isPseudoClass(node) &&
		node.nodes.length > 0 &&
		SELECTOR_CONTAINING_PSEUDO_CLASSES.has(node.value.toLowerCase())
	);
}
