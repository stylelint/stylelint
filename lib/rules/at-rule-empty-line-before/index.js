'use strict';

const addEmptyLineBefore = require('../../utils/addEmptyLineBefore');
const getPreviousNonSharedLineCommentNode = require('../../utils/getPreviousNonSharedLineCommentNode');
const hasEmptyLine = require('../../utils/hasEmptyLine');
const isAfterComment = require('../../utils/isAfterComment');
const isBlocklessAtRuleAfterBlocklessAtRule = require('../../utils/isBlocklessAtRuleAfterBlocklessAtRule');
const isBlocklessAtRuleAfterSameNameBlocklessAtRule = require('../../utils/isBlocklessAtRuleAfterSameNameBlocklessAtRule');
const isFirstNested = require('../../utils/isFirstNested');
const isFirstNodeOfRoot = require('../../utils/isFirstNodeOfRoot');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const optionsMatches = require('../../utils/optionsMatches');
const removeEmptyLinesBefore = require('../../utils/removeEmptyLinesBefore');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isString } = require('../../utils/validateTypes');

const ruleName = 'at-rule-empty-line-before';

const messages = ruleMessages(ruleName, {
	expected: 'Expected empty line before at-rule',
	rejected: 'Unexpected empty line before at-rule',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/at-rule-empty-line-before',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['always', 'never'],
			},
			{
				actual: secondaryOptions,
				possible: {
					except: [
						'after-same-name',
						'inside-block',
						'blockless-after-same-name-blockless',
						'blockless-after-blockless',
						'first-nested',
					],
					ignore: [
						'after-comment',
						'first-nested',
						'inside-block',
						'blockless-after-same-name-blockless',
						'blockless-after-blockless',
					],
					ignoreAtRules: [isString],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/** @type {'always' | 'never'} */
		const expectation = primary;

		root.walkAtRules((atRule) => {
			const isNested = atRule.parent && atRule.parent.type !== 'root';

			// Ignore the first node
			if (isFirstNodeOfRoot(atRule)) {
				return;
			}

			if (!isStandardSyntaxAtRule(atRule)) {
				return;
			}

			// Return early if at-rule is to be ignored
			if (optionsMatches(secondaryOptions, 'ignoreAtRules', atRule.name)) {
				return;
			}

			// Optionally ignore the expectation if the node is blockless
			if (
				optionsMatches(secondaryOptions, 'ignore', 'blockless-after-blockless') &&
				isBlocklessAtRuleAfterBlocklessAtRule(atRule)
			) {
				return;
			}

			// Optionally ignore the node if it is the first nested
			if (optionsMatches(secondaryOptions, 'ignore', 'first-nested') && isFirstNested(atRule)) {
				return;
			}

			// Optionally ignore the expectation if the node is blockless
			// and following another blockless at-rule with the same name
			if (
				optionsMatches(secondaryOptions, 'ignore', 'blockless-after-same-name-blockless') &&
				isBlocklessAtRuleAfterSameNameBlocklessAtRule(atRule)
			) {
				return;
			}

			// Optionally ignore the expectation if the node is inside a block
			if (optionsMatches(secondaryOptions, 'ignore', 'inside-block') && isNested) {
				return;
			}

			// Optionally ignore the expectation if a comment precedes this node
			if (optionsMatches(secondaryOptions, 'ignore', 'after-comment') && isAfterComment(atRule)) {
				return;
			}

			const hasEmptyLineBefore = hasEmptyLine(atRule.raws.before);
			let expectEmptyLineBefore = expectation === 'always';

			// Optionally reverse the expectation if any exceptions apply
			if (
				(optionsMatches(secondaryOptions, 'except', 'after-same-name') &&
					isAtRuleAfterSameNameAtRule(atRule)) ||
				(optionsMatches(secondaryOptions, 'except', 'inside-block') && isNested) ||
				(optionsMatches(secondaryOptions, 'except', 'first-nested') && isFirstNested(atRule)) ||
				(optionsMatches(secondaryOptions, 'except', 'blockless-after-blockless') &&
					isBlocklessAtRuleAfterBlocklessAtRule(atRule)) ||
				(optionsMatches(secondaryOptions, 'except', 'blockless-after-same-name-blockless') &&
					isBlocklessAtRuleAfterSameNameBlocklessAtRule(atRule))
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			// Return if the expectation is met
			if (expectEmptyLineBefore === hasEmptyLineBefore) {
				return;
			}

			// Fix
			if (context.fix && context.newline) {
				if (expectEmptyLineBefore) {
					addEmptyLineBefore(atRule, context.newline);
				} else {
					removeEmptyLinesBefore(atRule, context.newline);
				}

				return;
			}

			const message = expectEmptyLineBefore ? messages.expected : messages.rejected;

			report({ message, node: atRule, result, ruleName });
		});
	};
};

/**
 * @param {import('postcss').AtRule} atRule
 */
function isAtRuleAfterSameNameAtRule(atRule) {
	const previousNode = getPreviousNonSharedLineCommentNode(atRule);

	// @ts-expect-error -- TS2339: Property 'name' does not exist on type 'Node'.
	return previousNode && previousNode.type === 'atrule' && previousNode.name === atRule.name;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
