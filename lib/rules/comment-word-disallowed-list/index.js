'use strict';

const containsString = require('../../utils/containsString');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'comment-word-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (pattern) => `Unexpected word matching pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/comment-word-disallowed-list',
};

/** @type {import('stylelint').Rule<string | RegExp | Array<string | RegExp>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString, isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkComments((comment) => {
			const text = comment.text;
			const rawComment = comment.toString();
			const firstFourChars = rawComment.slice(0, 4);

			// Return early if sourcemap
			if (firstFourChars === '/*# ') {
				return;
			}

			const matchesWord = matchesStringOrRegExp(text, primary) || containsString(text, primary);

			if (!matchesWord) {
				return;
			}

			report({
				message: messages.rejected(matchesWord.pattern),
				node: comment,
				word: matchesWord.substring,
				result,
				ruleName,
			});
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
