// @ts-nocheck

'use strict';

const _ = require('lodash');
const containsString = require('../../utils/containsString');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'comment-word-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (pattern) => `Unexpected word matching pattern "${pattern}"`,
});

function rule(list) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: list,
			possible: [_.isString, _.isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkComments((comment) => {
			const text = comment.text;
			const rawComment = comment.toString();
			const firstFourChars = rawComment.substr(0, 4);

			// Return early if sourcemap
			if (firstFourChars === '/*# ') {
				return;
			}

			const matchesWord = matchesStringOrRegExp(text, list) || containsString(text, list);

			if (!matchesWord) {
				return;
			}

			report({
				message: messages.rejected(matchesWord.pattern),
				node: comment,
				result,
				ruleName,
			});
		});
	};
}

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
