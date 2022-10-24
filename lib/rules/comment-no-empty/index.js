'use strict';

const isStandardSyntaxComment = require('../../utils/isStandardSyntaxComment');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'comment-no-empty';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected empty comment',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/comment-no-empty',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkComments((comment) => {
			// To ignore non-standard comments
			if (!isStandardSyntaxComment(comment)) {
				return;
			}

			// To ignore comments that are not empty
			if (comment.text && comment.text.length !== 0) {
				return;
			}

			report({
				message: messages.rejected,
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
