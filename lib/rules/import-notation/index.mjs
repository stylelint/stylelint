import valueParser from 'postcss-value-parser';

import atRuleParamIndex from '../../utils/atRuleParamIndex.mjs';
import getAtRuleParams from '../../utils/getAtRuleParams.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setAtRuleParams from '../../utils/setAtRuleParams.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'import-notation';

const messages = ruleMessages(ruleName, {
	expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/import-notation',
	fixable: true,
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
						const urlFunctionArguments = valueParser.stringify(node.nodes);

						const quotedUrlFunctionFirstArgument =
							node.nodes[0] && node.nodes[0].type === 'word'
								? `"${urlFunctionArguments}"`
								: urlFunctionArguments;

						if (context.fix) {
							const restAtRuleParams = atRule.params.slice(node.sourceEndIndex);

							setAtRuleParams(atRule, `${quotedUrlFunctionFirstArgument}${restAtRuleParams}`);

							return;
						}

						complain(
							messages.expected(urlFunctionFull, quotedUrlFunctionFirstArgument),
							atRule,
							start,
							end,
						);

						return;
					}
				}

				if (primary === 'url') {
					if (node.type === 'space') return;

					if (node.type === 'word' || node.type === 'string') {
						const path = valueParser.stringify(node);

						const urlFunctionFull = `url(${path})`;

						if (context.fix) {
							const restAtRuleParams = atRule.params.slice(node.sourceEndIndex);

							setAtRuleParams(atRule, `${urlFunctionFull}${restAtRuleParams}`);

							return;
						}

						const quotedNodeValue =
							node.type === 'word' ? `"${node.value}"` : `${node.quote}${node.value}${node.quote}`;

						complain(messages.expected(quotedNodeValue, urlFunctionFull), atRule, start, end);

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
export default rule;
