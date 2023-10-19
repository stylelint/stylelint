import valueParser from 'postcss-value-parser';

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import declarationValueIndex from '../../utils/declarationValueIndex.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import { isValueFunction } from '../../utils/typeGuards.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'custom-property-pattern';

const messages = ruleMessages(ruleName, {
	expected: (propName, pattern) => `Expected "${propName}" to match pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/custom-property-pattern',
};

const VAR_FUNC_REGEX = /var\(/i;

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
					if (!isValueFunction(node)) return;

					if (node.value.toLowerCase() !== 'var') return;

					const { nodes } = node;

					const firstNode = nodes[0];

					if (!firstNode || check(firstNode.value)) return;

					complain(declarationValueIndex(decl) + firstNode.sourceIndex, firstNode.value, decl);
				});
			}

			if (check(prop)) return;

			complain(0, prop, decl);
		});

		/**
		 * @param {number} index
		 * @param {string} propName
		 * @param {import('postcss').Declaration} decl
		 */
		function complain(index, propName, decl) {
			report({
				result,
				ruleName,
				message: messages.expected,
				messageArgs: [propName, primary],
				node: decl,
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
