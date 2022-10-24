'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const optionsMatches = require('../../utils/optionsMatches');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString, isBoolean } = require('../../utils/validateTypes');

const ruleName = 'selector-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-disallowed-list',
};

/** @type {import('stylelint').Rule<string | RegExp | Array<string | RegExp>, { splitList: boolean, ignore: string[] }>} */
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
					ignore: ['inside-block'],
					splitList: [isBoolean],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const ignoreInsideBlock = optionsMatches(secondaryOptions, 'ignore', 'inside-block');
		const splitList = secondaryOptions && secondaryOptions.splitList;

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
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
							message: messages.rejected(selector),
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
						message: messages.rejected(selector),
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
module.exports = rule;
