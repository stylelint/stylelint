import { isBoolean, isRegExp, isString } from '../../utils/validateTypes.mjs';
import isKeyframeRule from '../../utils/isKeyframeRule.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import matchesStringOrRegExp from '../../utils/matchesStringOrRegExp.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-disallowed-list',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [isString, isRegExp],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['inside-block', 'keyframe-selectors'],
					splitList: [isBoolean],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const ignoreInsideBlock = optionsMatches(secondaryOptions, 'ignore', 'inside-block');
		const ignoreKeyframeSelectors = optionsMatches(
			secondaryOptions,
			'ignore',
			'keyframe-selectors',
		);

		const splitList = secondaryOptions && secondaryOptions.splitList;

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			if (ignoreKeyframeSelectors && isKeyframeRule(ruleNode)) {
				return;
			}

			if (ignoreInsideBlock) {
				const { parent } = ruleNode;
				const isInsideBlock = parent && parent.type !== 'root';

				if (isInsideBlock) {
					return;
				}
			}

			if (splitList) {
				ruleNode.selectors.forEach((selector) => {
					if (matchesStringOrRegExp(selector, primary)) {
						report({
							result,
							ruleName,
							message: messages.rejected,
							messageArgs: [selector],
							node: ruleNode,
							word: selector,
						});
					}
				});
			} else {
				const { selector, raws } = ruleNode;

				if (matchesStringOrRegExp(selector, primary)) {
					const word = (raws.selector && raws.selector.raw) || selector;

					report({
						result,
						ruleName,
						message: messages.rejected,
						messageArgs: [selector],
						node: ruleNode,
						word,
					});
				}
			}
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
