'use strict';

const isStandardSyntaxComment = require('../../utils/isStandardSyntaxComment');
const isWhitespace = require('../../utils/isWhitespace');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'comment-whitespace-inside';

const messages = ruleMessages(ruleName, {
	expectedOpening: 'Expected whitespace after "/*"',
	rejectedOpening: 'Unexpected whitespace after "/*"',
	expectedClosing: 'Expected whitespace before "*/"',
	rejectedClosing: 'Unexpected whitespace before "*/"',
});

/**
 * @param {import('postcss').Comment} comment
 */
function addWhitespaceBefore(comment) {
	if (comment.text.startsWith('*')) {
		comment.text = comment.text.replace(/^(\*+)/, `$1 `);
	} else {
		comment.raws.left = ' ';
	}
}

/**
 * @param {import('postcss').Comment} comment
 */
function addWhitespaceAfter(comment) {
	if (comment.text[comment.text.length - 1] === '*') {
		comment.text = comment.text.replace(/(\*+)$/, ` $1`);
	} else {
		comment.raws.right = ' ';
	}
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'never'],
		});

		if (!validOptions) {
			return;
		}

		root.walkComments((comment) => {
			if (!isStandardSyntaxComment(comment)) {
				return;
			}

			const rawComment = comment.toString();
			const firstFourChars = rawComment.substr(0, 4);

			// Return early if sourcemap or copyright comment
			if (/^\/\*[#!]\s/.test(firstFourChars)) {
				return;
			}

			const leftMatches = rawComment.match(/(^\/\*+)(\s)?/);

			if (leftMatches == null) throw new Error(`Invalid comment: "${rawComment}"`);

			const rightMatches = rawComment.match(/(\s)?(\*+\/)$/);

			if (rightMatches == null) throw new Error(`Invalid comment: "${rawComment}"`);

			const leftSpace = leftMatches[2] || '';
			const rightSpace = rightMatches[1] || '';

			if (primary === 'never' && leftSpace !== '') {
				complain(messages.rejectedOpening);
			}

			if (primary === 'always' && !isWhitespace(leftSpace)) {
				complain(messages.expectedOpening);
			}

			if (primary === 'never' && rightSpace !== '') {
				complain(messages.rejectedClosing, true);
			}

			if (primary === 'always' && !isWhitespace(rightSpace)) {
				complain(messages.expectedClosing, true);
			}

			/**
			 * @param {string} message
			 * @param {boolean} [right]
			 */
			function complain(message, right = false) {
				if (context.fix) {
					if (primary === 'never') {
						comment.raws.left = '';
						comment.raws.right = '';
						comment.text = comment.text.replace(/^(\*+)(\s+)?/, '$1').replace(/(\s+)?(\*+)$/, '$2');
					} else {
						if (!leftSpace) {
							addWhitespaceBefore(comment);
						}

						if (!rightSpace) {
							addWhitespaceAfter(comment);
						}
					}

					return;
				}

				const firstBreak = rawComment.indexOf('\n');
				const lastBreak = rawComment.lastIndexOf('\n');
				const [index, endIndex] = right
					? [lastBreak === -1 ? rawComment.length : lastBreak + 1, rawComment.length]
					: [0, firstBreak === -1 ? rawComment.length : firstBreak];

				report({
					message,
					index,
					endIndex,
					result,
					ruleName,
					node: comment,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
