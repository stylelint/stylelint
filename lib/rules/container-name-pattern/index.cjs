// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const valueParser = require('postcss-value-parser');
const validateTypes = require('../../utils/validateTypes.cjs');
const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const regexes = require('../../utils/regexes.cjs');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule.cjs');
const isStandardSyntaxContainerName = require('../../utils/isStandardSyntaxContainerName.cjs');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

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
			possible: [validateTypes.isRegExp, validateTypes.isString],
		});

		if (!validOptions) {
			return;
		}

		const regex = validateTypes.isString(primary) ? new RegExp(primary) : primary;

		root.walkDecls((decl) => {
			const { value } = decl;

			const parsedValue = valueParser(value);

			if (!isStandardSyntaxDeclaration(decl)) return;

			const firstNode = parsedValue.nodes[0];

			if (!firstNode) return;

			if (regex.test(firstNode.value)) return;

			complain(nodeFieldIndices.declarationValueIndex(decl) + firstNode.sourceIndex, firstNode.value, decl);
		});

		root.walkAtRules(regexes.atRuleRegexes.containerName, (atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) return;

			const { params } = atRule;

			const parsedValue = valueParser(params);

			let functions = [];

			parsedValue.walk((node) => {
				if (node.type === 'function') functions.push(node);

				if (node.type !== 'word') return;

				if (!isStandardSyntaxContainerName(node.value)) return;

				for (const child of functions) {
					if (child.nodes.includes(node)) return;
				}

				if (regex.test(node.value)) return;

				const index = nodeFieldIndices.atRuleParamIndex(atRule) + node.sourceIndex;

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

module.exports = rule;
