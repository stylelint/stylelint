import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import matchesStringOrRegExp from '../../utils/matchesStringOrRegExp.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';
import vendor from '../../utils/vendor.mjs';

const ruleName = 'selector-pseudo-element-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected pseudo-element "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-pseudo-element-allowed-list',
};

/** @type {import('stylelint').Rule<string | RegExp | Array<string | RegExp>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString, isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const selector = ruleNode.selector;

			if (!selector.includes('::')) {
				return;
			}

			parseSelector(selector, result, ruleNode)?.walkPseudos((pseudoNode) => {
				const value = pseudoNode.value;

				// Ignore pseudo-classes
				if (value.charAt(1) !== ':') {
					return;
				}

				const name = value.slice(2);

				// Pseudo is in allowlist
				if (matchesStringOrRegExp(name, primary)) {
					return;
				}

				// Unprefixed-pseudo is in allowlist
				if (matchesStringOrRegExp(vendor.unprefixed(name), primary)) {
					return;
				}

				report({
					index: pseudoNode.sourceIndex,
					message: messages.rejected,
					messageArgs: [value],
					node: ruleNode,
					word: value,
					result,
					ruleName,
				});
			});
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
