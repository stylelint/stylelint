'use strict';

const valueParser = require('postcss-value-parser');

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const setAtRuleParams = require('../../utils/setAtRuleParams');
const getAtRuleParams = require('../../utils/getAtRuleParams');
const atRuleParamIndex = require('../../utils/atRuleParamIndex');

const ruleName = 'import-notation';

const messages = ruleMessages(ruleName, {
	expected: (importUrlOrString, primary) => `Expected "${importUrlOrString}" to be a "${primary}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/import-notation',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['string', 'url'],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^import$/i, checkAtRuleImportParams);

		/**
		 * @param {import('postcss').AtRule} atRule
		 */
		function checkAtRuleImportParams(atRule) {
			const params = getAtRuleParams(atRule);
			const parsed = valueParser(params);

			for (const node of parsed.nodes) {
				const start = atRuleParamIndex(atRule);
				const end = start + node.sourceEndIndex;

				if (primary === 'string') {
					if (node.type === 'function' && node.value.toLowerCase() === 'url') {
						const urlFunctionFull = valueParser.stringify(node);

						if (context.fix) {
							const urlFunctionArguments = valueParser.stringify(node.nodes);
							const restAtRuleParams = atRule.params.slice(node.sourceEndIndex);

							setAtRuleParams(atRule, `${urlFunctionArguments}${restAtRuleParams}`);

							return;
						}

						complain(messages.expected(urlFunctionFull, primary), atRule, start, end);

						return;
					}
				}

				if (primary === 'url') {
					if (node.type === 'space') return;

					if (node.type === 'word' || node.type === 'string') {
						const path = valueParser.stringify(node);

						if (context.fix) {
							const urlFunctionFull = `url(${path})`;
							const restAtRuleParams = atRule.params.slice(node.sourceEndIndex);

							setAtRuleParams(atRule, `${urlFunctionFull}${restAtRuleParams}`);

							return;
						}

						complain(messages.expected(node.value, primary), atRule, start, end);

						return;
					}
				}
			}
		}

		/**
		 * @param {string} message
		 * @param {import('postcss').Node} node
		 * @param {number} index
		 * @param {number} endIndex
		 */
		function complain(message, node, index, endIndex) {
			report({
				message,
				node,
				index,
				endIndex,
				result,
				ruleName,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
