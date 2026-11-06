/**
 * @param {import('postcss').Rule} ruleNode
 * @returns {string}
 */
export default function getRuleSelector(ruleNode) {
	const raw = ruleNode.raws.selector;

	// PostCSS ignores the raw once a new selector is assigned
	return raw && raw.value === ruleNode.selector ? raw.raw : ruleNode.selector;
}
