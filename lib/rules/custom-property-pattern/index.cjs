// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const validateTypes = require('../../utils/validateTypes.cjs');
const regexes = require('../../utils/regexes.cjs');
const isCustomProperty = require('../../utils/isCustomProperty.cjs');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty.cjs');
const isVarFunction = require('../../utils/isVarFunction.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const valueParser = require('postcss-value-parser');

const ruleName = 'custom-property-pattern';

const messages = ruleMessages(ruleName, {
	expected: (property, pattern) => `Expected "${property}" to match pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/custom-property-pattern',
};

const VAR_FUNC_REGEX = /var\(/i;

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateTypes.isRegExp, validateTypes.isString],
		});

		if (!validOptions) return;

		const regexpPattern = validateTypes.isString(primary) ? new RegExp(primary) : primary;

		/**
		 * @param {string} property
		 * @returns {boolean}
		 */
		function check(property) {
			return (
				!isCustomProperty(property) ||
				!isStandardSyntaxProperty(property) ||
				regexpPattern.test(property.slice(2))
			);
		}

		root.walkDecls((decl) => {
			const { prop, value } = decl;

			if (VAR_FUNC_REGEX.test(value)) {
				const parsedValue = valueParser(value);

				parsedValue.walk((node) => {
					if (!isVarFunction(node)) return;

					const { nodes } = node;
					const firstNode = nodes[0];

					if (!firstNode || check(firstNode.value)) return;

					complain(nodeFieldIndices.declarationValueIndex(decl) + firstNode.sourceIndex, firstNode.value, decl);
				});
			}

			if (check(prop)) return;

			complain(0, prop, decl);
		});

		root.walkAtRules(regexes.atRuleRegexes.propertyName, (atRule) => {
			const { params: propName } = atRule;

			if (check(propName)) return;

			complain(nodeFieldIndices.atRuleParamIndex(atRule), propName, atRule);
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
