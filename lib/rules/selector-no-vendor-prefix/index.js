'use strict';

const isAutoprefixable = require('../../utils/isAutoprefixable');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const optionsMatches = require('../../utils/optionsMatches');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isString } = require('../../utils/validateTypes');

const ruleName = 'selector-no-vendor-prefix';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected vendor-prefix "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-no-vendor-prefix',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignoreSelectors: [isString],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const selector = ruleNode.selector;

			parseSelector(selector, result, ruleNode, (selectorTree) => {
				selectorTree.walkPseudos((pseudoNode) => {
					if (isAutoprefixable.selector(pseudoNode.value)) {
						if (optionsMatches(secondaryOptions, 'ignoreSelectors', pseudoNode.value)) {
							return;
						}

						if (context.fix) {
							ruleNode.selector = isAutoprefixable.unprefix(ruleNode.selector);

							return;
						}

						report({
							result,
							ruleName,
							message: messages.rejected(pseudoNode.value),
							node: ruleNode,
							index: (ruleNode.raws.before || '').length + pseudoNode.sourceIndex,
						});
					}
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
