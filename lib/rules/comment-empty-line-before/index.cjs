// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const addEmptyLineBefore = require('../../utils/addEmptyLineBefore.cjs');
const emptyLineBeforeFixer = require('../../utils/emptyLineBeforeFixer.cjs');
const hasEmptyLine = require('../../utils/hasEmptyLine.cjs');
const isAfterComment = require('../../utils/isAfterComment.cjs');
const configurationComment = require('../../utils/configurationComment.cjs');
const isFirstNested = require('../../utils/isFirstNested.cjs');
const isFirstNodeOfRoot = require('../../utils/isFirstNodeOfRoot.cjs');
const isSharedLineComment = require('../../utils/isSharedLineComment.cjs');
const isStandardSyntaxComment = require('../../utils/isStandardSyntaxComment.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const removeEmptyLinesBefore = require('../../utils/removeEmptyLinesBefore.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'comment-empty-line-before';

const messages = ruleMessages(ruleName, {
	expected: 'Expected empty line before comment',
	rejected: 'Unexpected empty line before comment',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/comment-empty-line-before',
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
					except: ['first-nested'],
					ignore: ['stylelint-commands', 'after-comment'],
					ignoreComments: [validateTypes.isString, validateTypes.isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkComments((comment) => {
			// Ignore the first node
			if (isFirstNodeOfRoot(comment)) {
				return;
			}

			// Optionally ignore stylelint commands
			if (
				configurationComment.isConfigurationComment(comment, context.configurationComment) &&
				optionsMatches(secondaryOptions, 'ignore', 'stylelint-commands')
			) {
				return;
			}

			// Optionally ignore newlines between comments
			if (optionsMatches(secondaryOptions, 'ignore', 'after-comment') && isAfterComment(comment)) {
				return;
			}

			// Ignore comments matching the ignoreComments option.
			if (optionsMatches(secondaryOptions, 'ignoreComments', comment.text)) {
				return;
			}

			// Ignore shared-line comments
			if (isSharedLineComment(comment)) {
				return;
			}

			// Ignore non-standard comments
			if (!isStandardSyntaxComment(comment)) {
				return;
			}

			const expectEmptyLineBefore = (() => {
				if (optionsMatches(secondaryOptions, 'except', 'first-nested') && isFirstNested(comment)) {
					return false;
				}

				return primary === 'always';
			})();

			const before = comment.raws.before || '';
			const hasEmptyLineBefore = hasEmptyLine(before);

			// Return if the expectation is met
			if (expectEmptyLineBefore === hasEmptyLineBefore) {
				return;
			}

			const message = expectEmptyLineBefore ? messages.expected : messages.rejected;
			const mutate = expectEmptyLineBefore ? addEmptyLineBefore : removeEmptyLinesBefore;

			// Fix
			const fix = emptyLineBeforeFixer.bind(null, {
				node: comment,
				newline: context.newline,
				mutate,
			});

			report({
				message,
				node: comment,
				result,
				ruleName,
				fix,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
