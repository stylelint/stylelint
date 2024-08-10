import selectorParser from 'postcss-selector-parser';

/**
 * Get the source index of a selector, excluding leading whitespace.
 *
 * @param {import('postcss-selector-parser').Selector} node
 *
 * @returns {{selectorStr: string, index: number, endIndex: number}}
 */
export default function getSelectorMeaningfulSource(node) {
	const firstIndex = node.nodes.findIndex((x) => !selectorParser.isComment(x));
	const lastIndex = node.nodes.findLastIndex((x) => !selectorParser.isComment(x));

	const first = node.nodes[firstIndex];
	let last = node.nodes[lastIndex];

	if (!first || !last) {
		const selectorStr = node.toString().trim();
		const index = node.sourceIndex;
		const endIndex = index + selectorStr.length;

		return {
			selectorStr,
			index,
			endIndex,
		};
	}

	last = last.rawSpaceAfter.length ? last.clone() : last;
	last.rawSpaceAfter = '';

	let selectorStr = node.nodes.slice(firstIndex, lastIndex).map(String).join('');

	selectorStr += last.toString();
	selectorStr = selectorStr.trim();

	const index = first.sourceIndex;
	const endIndex = index + selectorStr.length;

	return {
		selectorStr,
		index,
		endIndex,
	};
}
