import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import matchesStringOrRegExp from '../../utils/matchesStringOrRegExp.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';
import vendor from '../../utils/vendor.mjs';

const ruleName = 'selector-pseudo-class-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected pseudo-class "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-pseudo-class-allowed-list',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
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

			if (!ruleNode.selector.includes(':')) {
				return;
			}

			parseSelector(getRuleSelector(ruleNode), result, ruleNode)?.walkPseudos((pseudoNode) => {
				const value = pseudoNode.value;
				const index = pseudoNode.sourceIndex;
				const endIndex = index + pseudoNode.value.length;

				// Ignore pseudo-elements
				if (value.slice(0, 2) === '::') {
					return;
				}

				const name = value.slice(1);

				if (matchesStringOrRegExp(name, primary)) {
					return;
				}

				if (matchesStringOrRegExp(vendor.unprefixed(name), primary)) {
					return;
				}

				report({
					message: messages.rejected,
					messageArgs: [value],
					node: ruleNode,
					result,
					ruleName,
					index,
					endIndex,
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
