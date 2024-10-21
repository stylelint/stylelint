import atRuleRawsAfterNameIndex from './atRuleRawsAfterNameIndex.mjs';

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {number}
 */
export default function atRuleParamIndex(atRule) {
	let index = atRuleRawsAfterNameIndex(atRule);

	if (atRule.raws.afterName) {
		index += atRule.raws.afterName.length;
	}

	return index;
}
