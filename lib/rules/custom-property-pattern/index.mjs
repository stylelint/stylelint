import valueParser from 'postcss-value-parser';

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import isVarFunction from '../../utils/isVarFunction.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'custom-property-pattern';

const messages = ruleMessages(ruleName, {
	expected: (property, pattern) => `Expected "${property}" to match pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/custom-property-pattern',
};
const VAR_FUNC_REGEX = /var\(/i;

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isRegExp, isString],
		});

		if (!validOptions) return;

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
					if (!isVarFunction(node)) return;

					const { nodes } = node;
					const firstNode = nodes[0];

					if (!firstNode || check(firstNode.value)) return;

					complain(declarationValueIndex(decl) + firstNode.sourceIndex, firstNode.value, decl);
				});
			}

			if (check(prop)) return;

			complain(0, prop, decl);
		});
		root.walkAtRules('property', (atRule) => {
			const params = atRule.params || '';
			const tokens = params.split(/\s/);
			const propName = (tokens[0] || '').trim();

			if (check(propName)) return;

			const startColumn = atRule.source && atRule.source.start ? atRule.source.start.column : 0;
			const baseIndex = startColumn + 2;
			const extra = propName.endsWith('-') ? 1 : 0;

			complain(baseIndex, propName, /** @type {any} */ (atRule), extra);
		});

		/**
		 * @param {number} index
		 * @param {string} propName
		 * @param {import('postcss').Declaration|import('postcss').AtRule} node
		 * @param {number} [extra=0]
		 */
		function complain(index, propName, node, extra = 0) {
			report({
				result,
				ruleName,
				message: messages.expected,
				messageArgs: [propName, primary],
				node,
				index,
				endIndex: index + propName.length + extra,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
