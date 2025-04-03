import valueParser from 'postcss-value-parser';

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { atRuleParamIndex } from '../../utils/nodeFieldIndices.mjs';
import { atRuleRegexes } from '../../utils/regexes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import isStandardSyntaxAtRule from '../../utils/isStandardSyntaxAtRule.mjs';
import isStandardSyntaxContainerName from '../../utils/isStandardSyntaxContainerName.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
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

		root.walkDecls((decl) => {
			const { value } = decl;

			const parsedValue = valueParser(value);

			if (!isStandardSyntaxDeclaration(decl)) return;

			const firstNode = parsedValue.nodes[0];

			if (!firstNode) return;

			if (regex.test(firstNode.value)) return;

			complain(declarationValueIndex(decl) + firstNode.sourceIndex, firstNode.value, decl);
		});

		root.walkAtRules(atRuleRegexes.containerName, (atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) return;

			const { params } = atRule;

			const parsedValue = valueParser(params);

			let functions = [];

			parsedValue.walk((node) => {
				if (node.type === 'function') functions.push(node);

				if (node.type !== 'word') return false;

				if (!isStandardSyntaxContainerName(node.value)) return;

				for (const child of functions) {
					if (child.nodes.includes(node)) return;
				}

				if (regex.test(node.value)) return;

				const index = atRuleParamIndex(atRule) + node.sourceIndex;

				complain(index, node.value, atRule);
			});
		});

		/**
		 * @param {number} index
		 * @param {string} propName
		 * @param {import('postcss').Declaration|import('postcss').AtRule} node
		 */
		function complain(index, propName, node) {
			report({
				result,
				ruleName,
				message: messages.expected,
				messageArgs: [propName, primary],
				node,
				index,
				endIndex: index + propName.length,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
