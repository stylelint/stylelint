'use strict';

const valueParser = require('postcss-value-parser');
const isCustomProperty = require('../../utils/isCustomProperty');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const { isRegExp, isString } = require('../../utils/validateTypes');
const { isValueFunction } = require('../../utils/typeGuards');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');

const ruleName = 'custom-property-pattern';

const messages = ruleMessages(ruleName, {
	expected: (pattern) => `Expected custom property name to match pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/custom-property-pattern',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isRegExp, isString],
		});

		if (!validOptions) {
			return;
		}

		const regexpPattern = isString(primary) ? new RegExp(primary) : primary;

		/**
		 * @param {string} property
		 * @returns {boolean}
		 */
		function check(property) {
			return (
				!isStandardSyntaxProperty(property) ||
				!isCustomProperty(property) ||
				regexpPattern.test(property.slice(2))
			);
		}

		root.walkDecls((decl) => {
			const { prop, value } = decl;

			const parsedValue = valueParser(value);

			parsedValue.walk((node) => {
				if (!isValueFunction(node)) return;

				if (node.value.toLowerCase() !== 'var') return;

				const { nodes, sourceIndex } = node;

				const firstNode = nodes[0];

				if (!firstNode || check(firstNode.value)) return;

				complain(declarationValueIndex(decl) + sourceIndex, decl);
			});

			if (check(prop)) return;

			complain(0, decl);
		});

		/**
		 * @param {number} index
		 * @param {import('postcss').Declaration} decl
		 */
		function complain(index, decl) {
			report({
				result,
				ruleName,
				message: messages.expected(primary),
				node: decl,
				index,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
