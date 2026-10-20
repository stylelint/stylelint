import { atRuleRegexes, mayIncludeRegexes } from '../../utils/regexes.mjs';
import { isMediaFeature, isMediaQueryInvalid } from '@csstools/media-query-list-parser';
import { atRuleParamIndex } from '../../utils/nodeFieldIndices.mjs';
import isCustomMediaQuery from '../../utils/isCustomMediaQuery.mjs';
import memoizeForReferenceRoots from '../../utils/memoizeForReferenceRoots.mjs';
import parseCustomMediaQuery from '../../utils/parseCustomMediaQuery.mjs';
import parseMediaQuery from '../../utils/parseMediaQuery.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'no-unknown-custom-media';

const messages = ruleMessages(ruleName, {
	rejected: (mediaName) => `Unknown custom media query "${mediaName}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-unknown-custom-media',
};

/** @import {Root} from 'postcss' */

const getDeclaredCustomMediaQueriesOfRoots = memoizeForReferenceRoots(
	getDeclaredCustomMediaQueries,
);

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		const declaredCustomMediaQueries = getDeclaredCustomMediaQueriesOfRoots(
			root,
			result.stylelint.referenceRoots,
		);

		/** @param {string} name */
		const isDeclared = (name) => declaredCustomMediaQueries.some((declared) => declared.has(name));

		root.walkAtRules(atRuleRegexes.mediaName, (atRule) => {
			if (!mayIncludeRegexes.customProperty.test(atRule.params)) return;

			const mediaQueryList = parseMediaQuery(atRule);

			mediaQueryList.forEach((mediaQuery) => {
				if (isMediaQueryInvalid(mediaQuery)) return;

				mediaQuery.walk(({ node }) => {
					if (!isMediaFeature(node)) return;

					const [, name, start, end] = node.getNameToken();

					if (!isCustomMediaQuery(name)) return;

					if (isDeclared(name)) return;

					const baseIndex = atRuleParamIndex(atRule);
					const index = baseIndex + start;
					const endIndex = baseIndex + end + 1;

					report({
						message: messages.rejected,
						messageArgs: [name],
						node: atRule,
						index,
						endIndex,
						result,
						ruleName,
					});
				});
			});
		});
	};
};

/**
 * @param {Root} rootNode
 * @returns {Set<string>}
 */
function getDeclaredCustomMediaQueries(rootNode) {
	/** @type {Set<string>} */
	const declared = new Set();

	rootNode.walkAtRules(atRuleRegexes.customMediaName, (atRule) => {
		const customMediaQuery = parseCustomMediaQuery(atRule);

		if (!customMediaQuery) return;

		declared.add(customMediaQuery.getName());
	});

	return declared;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
