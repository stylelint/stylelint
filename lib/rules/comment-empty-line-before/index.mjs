import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import addEmptyLineBefore from '../../utils/addEmptyLineBefore.mjs';
import hasEmptyLine from '../../utils/hasEmptyLine.mjs';
import isAfterComment from '../../utils/isAfterComment.mjs';
import { isConfigurationComment } from '../../utils/configurationComment.mjs';
import isFirstNested from '../../utils/isFirstNested.mjs';
import isFirstNodeOfRoot from '../../utils/isFirstNodeOfRoot.mjs';
import isSharedLineComment from '../../utils/isSharedLineComment.mjs';
import isStandardSyntaxComment from '../../utils/isStandardSyntaxComment.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import removeEmptyLinesBefore from '../../utils/removeEmptyLinesBefore.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

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
				isConfigurationComment(comment, context.configurationComment) &&
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
export default rule;
