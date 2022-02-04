'use strict';

const addEmptyLineBefore = require('../../utils/addEmptyLineBefore');
const blockString = require('../../utils/blockString');
const getPreviousNonSharedLineCommentNode = require('../../utils/getPreviousNonSharedLineCommentNode');
const hasEmptyLine = require('../../utils/hasEmptyLine');
const isAfterComment = require('../../utils/isAfterComment');
const isCustomProperty = require('../../utils/isCustomProperty');
const isFirstNested = require('../../utils/isFirstNested');
const isSingleLineString = require('../../utils/isSingleLineString');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration');
const optionsMatches = require('../../utils/optionsMatches');
const removeEmptyLinesBefore = require('../../utils/removeEmptyLinesBefore');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isAtRule, isDeclaration, isRule } = require('../../utils/typeGuards');

const ruleName = 'custom-property-empty-line-before';

const messages = ruleMessages(ruleName, {
	expected: 'Expected empty line before custom property',
	rejected: 'Unexpected empty line before custom property',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/custom-property-empty-line-before',
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
					except: ['first-nested', 'after-comment', 'after-custom-property'],
					ignore: ['after-comment', 'first-nested', 'inside-single-line-block'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const prop = decl.prop;
			const parent = decl.parent;

			if (!isStandardSyntaxDeclaration(decl)) {
				return;
			}

			if (!isCustomProperty(prop)) {
				return;
			}

			// Optionally ignore the node if a comment precedes it
			if (optionsMatches(secondaryOptions, 'ignore', 'after-comment') && isAfterComment(decl)) {
				return;
			}

			// Optionally ignore the node if it is the first nested
			if (optionsMatches(secondaryOptions, 'ignore', 'first-nested') && isFirstNested(decl)) {
				return;
			}

			// Optionally ignore nodes inside single-line blocks
			if (
				optionsMatches(secondaryOptions, 'ignore', 'inside-single-line-block') &&
				parent != null &&
				(isAtRule(parent) || isRule(parent)) &&
				isSingleLineString(blockString(parent))
			) {
				return;
			}

			let expectEmptyLineBefore = primary === 'always';

			// Optionally reverse the expectation if any exceptions apply
			if (
				(optionsMatches(secondaryOptions, 'except', 'first-nested') && isFirstNested(decl)) ||
				(optionsMatches(secondaryOptions, 'except', 'after-comment') && isAfterComment(decl)) ||
				(optionsMatches(secondaryOptions, 'except', 'after-custom-property') &&
					isAfterCustomProperty(decl))
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			const hasEmptyLineBefore = hasEmptyLine(decl.raws.before);

			// Return if the expectation is met
			if (expectEmptyLineBefore === hasEmptyLineBefore) {
				return;
			}

			// Fix
			if (context.fix) {
				if (context.newline == null) return;

				if (expectEmptyLineBefore) {
					addEmptyLineBefore(decl, context.newline);
				} else {
					removeEmptyLinesBefore(decl, context.newline);
				}

				return;
			}

			const message = expectEmptyLineBefore ? messages.expected : messages.rejected;

			report({
				message,
				node: decl,
				result,
				ruleName,
			});
		});
	};
};

/**
 * @param {import('postcss').Declaration} decl
 */
function isAfterCustomProperty(decl) {
	const prevNode = getPreviousNonSharedLineCommentNode(decl);

	return prevNode != null && isDeclaration(prevNode) && isCustomProperty(prevNode.prop);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
