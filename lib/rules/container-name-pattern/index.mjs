import valueParser from 'postcss-value-parser';

import { atRuleRegexes, propertyRegexes } from '../../utils/regexes.mjs';
import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { atRuleParamIndex } from '../../utils/nodeFieldIndices.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import isStandardSyntaxAtRule from '../../utils/isStandardSyntaxAtRule.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'container-name-pattern';

const messages = ruleMessages(ruleName, {
	expected: (containerName, pattern) => `Expected "${containerName}" to match pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/container-name-pattern',
};

const KEYWORDS = new Set(['and', 'or', 'none', 'not']);

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isRegExp, isString],
		});

		if (!validOptions) {
			return;
		}

		const regex = isString(primary) ? new RegExp(primary) : primary;

		root.walkDecls(propertyRegexes.containerNameAndShorthandName, (decl) => {
			const { value } = decl;

			const parsedValue = valueParser(value);

			const firstNode = parsedValue.nodes[0];

			if (!firstNode) return;

			if (!isStandardSyntaxProperty(firstNode.value)) return;

			if (regex.test(firstNode.value)) return;

			complain(declarationValueIndex(decl) + firstNode.sourceIndex, firstNode.value, decl);
		});

		root.walkAtRules(atRuleRegexes.containerName, (atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) return;

			const { params } = atRule;

			const parsedValue = valueParser(params);

			parsedValue.walk(({ sourceIndex, type, value }) => {
				if (type !== 'word') return false;

				if (KEYWORDS.has(value.toLowerCase())) return;

				if (regex.test(value)) return;

				complain(atRuleParamIndex(atRule) + sourceIndex, value, atRule);
			});
		});

		/**
		 * @param {number} index
		 * @param {string} containerName
		 * @param {import('postcss').Declaration|import('postcss').AtRule} node
		 */
		function complain(index, containerName, node) {
			report({
				result,
				ruleName,
				message: messages.expected,
				messageArgs: [containerName, primary],
				node,
				index,
				endIndex: index + containerName.length,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
