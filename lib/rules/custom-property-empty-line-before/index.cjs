// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const typeGuards = require('../../utils/typeGuards.cjs');
const blockString = require('../../utils/blockString.cjs');
const fixEmptyLinesBefore = require('../../utils/fixEmptyLinesBefore.cjs');
const getPreviousNonSharedLineCommentNode = require('../../utils/getPreviousNonSharedLineCommentNode.cjs');
const hasEmptyLine = require('../../utils/hasEmptyLine.cjs');
const isAfterComment = require('../../utils/isAfterComment.cjs');
const isCustomProperty = require('../../utils/isCustomProperty.cjs');
const isFirstNested = require('../../utils/isFirstNested.cjs');
const isSingleLineString = require('../../utils/isSingleLineString.cjs');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'custom-property-empty-line-before';

const messages = ruleMessages(ruleName, {
	expected: 'Expected empty line before custom property',
	rejected: 'Unexpected empty line before custom property',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/custom-property-empty-line-before',
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
				(typeGuards.isAtRule(parent) || typeGuards.isRule(parent)) &&
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

			const message = expectEmptyLineBefore ? messages.expected : messages.rejected;
			const action = expectEmptyLineBefore ? 'add' : 'remove';

			// Fix
			const fix = () =>
				fixEmptyLinesBefore({
					node: decl,
					newline: context.newline,
					action,
				});

			report({
				message,
				node: decl,
				result,
				ruleName,
				fix,
			});
		});
	};
};

/**
 * @param {import('postcss').Declaration} decl
 */
function isAfterCustomProperty(decl) {
	const prevNode = getPreviousNonSharedLineCommentNode(decl);

	return prevNode != null && typeGuards.isDeclaration(prevNode) && isCustomProperty(prevNode.prop);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
