import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { atRuleRegexes } from '../../utils/regexes.mjs';
import { deprecatedMediaTypesNames } from '../../reference/mediaTypes.mjs';
import { isMediaQueryWithType } from '@csstools/media-query-list-parser';
import optionsMatches from '../../utils/optionsMatches.mjs';
import parseMediaQuery from '../../utils/parseMediaQuery.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'media-type-no-deprecated';

const messages = ruleMessages(ruleName, {
	rejected: (mediaType) => `Unexpected deprecated media type "${mediaType}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-type-no-deprecated',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignoreMediaType: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		root.walkAtRules(atRuleRegexes.mediaName, (atRule) => {
			const mediaQueryList = parseMediaQuery(atRule);

			mediaQueryList.forEach((mediaQuery) => {
				if (!isMediaQueryWithType(mediaQuery)) return;

				const mediaType = mediaQuery.getMediaType();

				if (!deprecatedMediaTypesNames.has(mediaType.toLowerCase())) return;

				if (optionsMatches(secondaryOptions, 'ignoreMediaType', mediaType)) return;

				const index = atRule.toString().indexOf(mediaType);
				const endIndex = index + mediaType.length;

				report({
					message: messages.rejected,
					messageArgs: [mediaType],
					node: atRule,
					index,
					endIndex,
					ruleName,
					result,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
