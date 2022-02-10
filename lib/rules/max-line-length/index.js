'use strict';

const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const { default: IntervalTree } = require('@flatten-js/interval-tree');
const validateOptions = require('../../utils/validateOptions');
const { isNumber, isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'max-line-length';
const EXCLUDED_PATTERNS = [
	/url\(\s*(\S.*\S)\s*\)/gi, // allow tab, whitespace in url content
	/@import\s+(['"].*['"])/gi,
];

const messages = ruleMessages(ruleName, {
	expected: (max) =>
		`Expected line length to be no more than ${max} ${max === 1 ? 'character' : 'characters'}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/max-line-length',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: isNumber,
			},
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['non-comments', 'comments'],
					ignorePattern: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		if (root.source == null) {
			throw new Error('The root node must have a source');
		}

		const ignoreNonComments = optionsMatches(secondaryOptions, 'ignore', 'non-comments');
		const ignoreComments = optionsMatches(secondaryOptions, 'ignore', 'comments');
		const rootString = context.fix ? root.toString() : root.source.input.css;

		/** @type {IntervalTree<boolean>} */
		const ignoreRanges = new IntervalTree();

		/** @type {IntervalTree<boolean>} */
		const commentRanges = new IntervalTree();

		root.walkComments((comment) => {
			const start = comment.source && comment.source.start;
			const end = comment.source && comment.source.end; // end is inclusive, unlike most other ranges

			if (!start || !end) {
				return;
			}

			commentRanges.insert([start.offset, end.offset + 1], true);
		});

		for (const pattern of EXCLUDED_PATTERNS) {
			for (const match of rootString.matchAll(pattern)) {
				if (match.index === undefined) {
					continue;
				}

				const subMatch = match[1] || '';
				const startOfSubString = match.index + match[0].indexOf(subMatch);

				ignoreRanges.insert([startOfSubString, startOfSubString + subMatch.length], true);
			}
		}

		const maxLineLength = primary;
		const lineRegex = /^.*(?=\r?\n)/gm;
		const matches = rootString.matchAll(lineRegex);

		for (const { 0: line, index } of matches) {
			if (index === undefined) {
				continue;
			}

			// if line matches ignore pattern, skip
			if (optionsMatches(secondaryOptions, 'ignorePattern', line)) {
				continue;
			}

			let effectiveLineLength = line.length;
			const endIndex = index + line.length;

			if (ignoreNonComments || ignoreComments) {
				const firstNonWhitespace = line.search(/\S/);
				const firstEndWhitespace = line.search(/(?<=\S)\s*$/);

				const lineStart = firstNonWhitespace === -1 ? index : index + firstNonWhitespace;
				const lineEnd = firstEndWhitespace === -1 ? endIndex : index + firstEndWhitespace;

				const comments = /** @type {[low: number, high: number][]} */ (
					commentRanges.search([index, endIndex], (_, { low, high }) => [low, high])
				);

				// For ignoreNonComments, only enforce length limit if entire
				// line is in a comment. For ignoreComments, only enforce length
				// limit if entire line is not in a comment.

				effectiveLineLength = ignoreNonComments ? 0 : line.length;

				for (const [start, end] of comments) {
					if (start <= lineStart && end >= lineEnd) {
						effectiveLineLength = ignoreNonComments ? line.length : 0;
						break;
					}
				}
			}

			const ignore = /** @type {[low: number, high: number][]} */ (
				ignoreRanges.search([index, endIndex], (_, { low, high }) => [low, high])
			);

			// subtract length of ignore ranges from line length
			for (const [start, end] of ignore) {
				if (effectiveLineLength <= 0) {
					break;
				}

				if (start <= index && end >= endIndex) {
					effectiveLineLength = 0;

					break;
				}

				if (start >= index && end <= endIndex) {
					effectiveLineLength -= end - start;
				} else if (start >= index && end > endIndex) {
					effectiveLineLength -= endIndex - start;
				} else if (start < index && end <= endIndex) {
					effectiveLineLength -= end - index;
				}
			}

			if (effectiveLineLength > maxLineLength) {
				report({
					message: messages.expected(maxLineLength),
					node: root,
					result,
					ruleName,
					index,
					endIndex,
				});
			}
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
