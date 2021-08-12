'use strict';

const isInlineComment = require('../../utils/isInlineComment');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'comment-no-empty';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected empty comment',
});

/** @type {import('stylelint').StylelintRule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkComments((comment) => {
			// To ignore inline SCSS comments
			if (isInlineComment(comment)) {
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
module.exports = rule;
