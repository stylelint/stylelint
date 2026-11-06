/**
 * @param {import('postcss').AtRule} atRule
 * @returns {string}
 */
export default function getAtRuleParams(atRule) {
	const raw = atRule.raws.params;

	// PostCSS ignores the raw once new params are assigned
	return raw && raw.value === atRule.params ? raw.raw : atRule.params;
}
