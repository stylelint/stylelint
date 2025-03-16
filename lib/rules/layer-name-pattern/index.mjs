import valueParser from 'postcss-value-parser';

import { atRuleRegexes, functionRegexes } from '../../utils/regexes.mjs';
import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { atRuleParamIndex } from '../../utils/nodeFieldIndices.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'layer-name-pattern';

const messages = ruleMessages(ruleName, {
	expected: (name, pattern) => `Expected "${name}" to match pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/layer-name-pattern',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isRegExp, isString],
		});

		if (!validOptions) return;

		const pattern = isString(primary) ? new RegExp(primary) : primary;

		root.walkAtRules(atRuleRegexes.layerName, (atRule) => {
			const { params } = atRule;

			if (!params) return;

			const parsedParams = valueParser(params);

			parsedParams.walk((node) => {
				if (node.type !== 'word') return;

				if (pattern.test(node.value)) return;

				const index = atRuleParamIndex(atRule) + node.sourceIndex;
				const endIndex = index + node.value.length;

				report({
					message: messages.expected(node.value, primary),
					node: atRule,
					index,
					endIndex,
					ruleName,
					result,
				});
			});
		});

		root.walkAtRules(atRuleRegexes.importName, (atRule) => {
			const { params } = atRule;

			if (!functionRegexes.layer.test(params)) return;

			const parsedParams = valueParser(atRule.params);

			parsedParams.walk((node) => {
				if (node.type !== 'function' || node.value.toLowerCase() !== 'layer') return;

				for (const child of node.nodes) {
					if (child.type !== 'word') continue;

					if (pattern.test(child.value)) continue;

					const index = atRuleParamIndex(atRule) + child.sourceIndex;
					const endIndex = index + child.value.length;

					report({
						message: messages.expected(child.value, primary),
						node: atRule,
						index,
						endIndex,
						ruleName,
						result,
					});
				}
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
