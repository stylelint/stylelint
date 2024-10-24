/**
 * @param {import('postcss').AtRule} node
 * @returns {number}
 */
export default function atRuleRawsAfterIndex(node) {
	// always subtract 1 for `}`

	if (!node.source?.end?.offset) return node.toString().length - 1;

	if (!node.raws?.after?.length) return node.source.end.offset - 1;

	return node.source.end.offset - (node.raws.after.length + 1);
}
