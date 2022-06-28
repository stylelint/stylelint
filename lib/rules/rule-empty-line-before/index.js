'use strict';

const addEmptyLineBefore = require('../../utils/addEmptyLineBefore');
const getPreviousNonSharedLineCommentNode = require('../../utils/getPreviousNonSharedLineCommentNode');
const hasEmptyLine = require('../../utils/hasEmptyLine');
const isAfterSingleLineComment = require('../../utils/isAfterSingleLineComment');
const isFirstNested = require('../../utils/isFirstNested');
const isFirstNodeOfRoot = require('../../utils/isFirstNodeOfRoot');
const isSingleLineString = require('../../utils/isSingleLineString');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const optionsMatches = require('../../utils/optionsMatches');
const removeEmptyLinesBefore = require('../../utils/removeEmptyLinesBefore');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'rule-empty-line-before';

const messages = ruleMessages(ruleName, {
	expected: 'Expected empty line before rule',
	rejected: 'Unexpected empty line before rule',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/rule-empty-line-before',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['always', 'never', 'always-multi-line', 'never-multi-line'],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['after-comment', 'first-nested', 'inside-block'],
					except: [
						'after-rule',
						'after-single-line-comment',
						'first-nested',
						'inside-block-and-after-rule',
						'inside-block',
					],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const expectation = /** @type {string} */ (primary);

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			// Ignore the first node
			if (isFirstNodeOfRoot(ruleNode)) {
				return;
			}

			// Optionally ignore the expectation if a comment precedes this node
			if (optionsMatches(secondaryOptions, 'ignore', 'after-comment')) {
				const prevNode = ruleNode.prev();

				if (prevNode && prevNode.type === 'comment') {
					return;
				}
			}

			// Optionally ignore the node if it is the first nested
			if (optionsMatches(secondaryOptions, 'ignore', 'first-nested') && isFirstNested(ruleNode)) {
				return;
			}

			const isNested = ruleNode.parent && ruleNode.parent.type !== 'root';

			// Optionally ignore the expectation if inside a block
			if (optionsMatches(secondaryOptions, 'ignore', 'inside-block') && isNested) {
				return;
			}

			// Ignore if the expectation is for multiple and the rule is single-line
			if (expectation.includes('multi-line') && isSingleLineString(ruleNode.toString())) {
				return;
			}

			let expectEmptyLineBefore = expectation.includes('always');

			// Optionally reverse the expectation if any exceptions apply
			if (
				(optionsMatches(secondaryOptions, 'except', 'first-nested') && isFirstNested(ruleNode)) ||
				(optionsMatches(secondaryOptions, 'except', 'after-rule') && isAfterRule(ruleNode)) ||
				(optionsMatches(secondaryOptions, 'except', 'inside-block-and-after-rule') &&
					isNested &&
					isAfterRule(ruleNode)) ||
				(optionsMatches(secondaryOptions, 'except', 'after-single-line-comment') &&
					isAfterSingleLineComment(ruleNode)) ||
				(optionsMatches(secondaryOptions, 'except', 'inside-block') && isNested)
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			const hasEmptyLineBefore = hasEmptyLine(ruleNode.raws.before);

			// Return if the expectation is met
			if (expectEmptyLineBefore === hasEmptyLineBefore) {
				return;
			}

			// Fix
			if (context.fix) {
				const newline = context.newline;

				if (typeof newline !== 'string') {
					throw new Error(`The "newline" property must be a string: ${newline}`);
				}

				if (expectEmptyLineBefore) {
					addEmptyLineBefore(ruleNode, newline);
				} else {
					removeEmptyLinesBefore(ruleNode, newline);
				}

				return;
			}

			const message = expectEmptyLineBefore ? messages.expected : messages.rejected;

			report({
				message,
				node: ruleNode,
				result,
				ruleName,
			});
		});
	};
};

/**
 * @param {import('postcss').Rule} ruleNode
 * @returns {boolean}
 */
function isAfterRule(ruleNode) {
	const prevNode = getPreviousNonSharedLineCommentNode(ruleNode);

	return prevNode != null && prevNode.type === 'rule';
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
