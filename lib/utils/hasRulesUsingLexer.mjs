import getStylelintRule from './getStylelintRule.mjs';

/**
 * @param {import('stylelint').Config} config
 * @returns {Promise<boolean>}
 */
export default async function hasRulesUsingLexer(config) {
	const ruleNames = config.rules ? Object.keys(config.rules) : [];

	const loadPromises = ruleNames.map(async (ruleName) => {
		const ruleFn = await getStylelintRule(ruleName, config);

		return ruleFn?.meta?.usesLexer === true;
	});

	const boolResults = await Promise.all(loadPromises);

	return boolResults.some((bool) => bool === true);
}
