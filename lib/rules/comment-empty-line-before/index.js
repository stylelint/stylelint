'use strict';

const addEmptyLineBefore = require('../../utils/addEmptyLineBefore');
const hasEmptyLine = require('../../utils/hasEmptyLine');
const isAfterComment = require('../../utils/isAfterComment');
const isFirstNested = require('../../utils/isFirstNested');
const isFirstNodeOfRoot = require('../../utils/isFirstNodeOfRoot');
const isSharedLineComment = require('../../utils/isSharedLineComment');
const isStandardSyntaxComment = require('../../utils/isStandardSyntaxComment');
const optionsMatches = require('../../utils/optionsMatches');
const removeEmptyLinesBefore = require('../../utils/removeEmptyLinesBefore');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'comment-empty-line-before';

const messages = ruleMessages(ruleName, {
	expected: 'Expected empty line before comment',
	rejected: 'Unexpected empty line before comment',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/comment-empty-line-before',
	fixable: true,
};

const stylelintCommandPrefix = 'stylelint-';

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
					ignoreComments: [isString, isRegExp],
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
				comment.text.startsWith(stylelintCommandPrefix) &&
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

			// Fix
			if (context.fix) {
				if (typeof context.newline !== 'string') return;

				if (expectEmptyLineBefore) {
					addEmptyLineBefore(comment, context.newline);
				} else {
					removeEmptyLinesBefore(comment, context.newline);
				}

				return;
			}

			const message = expectEmptyLineBefore ? messages.expected : messages.rejected;

			report({
				message,
				node: comment,
				result,
				ruleName,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
