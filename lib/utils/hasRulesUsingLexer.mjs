import getStylelintRule from './getStylelintRule.mjs';

/**
 * @param {import('stylelint').Config} config
 * @returns {Promise<boolean>}
 */
export default async function hasRulesUsingLexer(config) {
	if (!config.rules) return false;

	const ruleNames = Object.keys(config.rules);

	if (ruleNames.length === 0) return false;

	const loadPromises = ruleNames.map(async (ruleName) => {
		const ruleFn = await getStylelintRule(ruleName, config);

		return ruleFn?.meta?.usesLexer === true;
	});

	const boolResults = await Promise.all(loadPromises);

	return boolResults.some((bool) => bool === true);
}
