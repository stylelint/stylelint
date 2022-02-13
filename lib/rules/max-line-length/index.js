'use strict';

const execall = require('execall');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const styleSearch = require('style-search');
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
		// Array of skipped sub strings, i.e `url(...)`, `@import "..."`
		/** @type {Array<[number, number]>} */
		let skippedSubStrings = [];
		let skippedSubStringsIndex = 0;

		for (const pattern of EXCLUDED_PATTERNS)
			for (const match of execall(pattern, rootString)) {
				const subMatch = match.subMatches[0] || '';
				const startOfSubString = match.index + match.match.indexOf(subMatch);

				skippedSubStrings.push([startOfSubString, startOfSubString + subMatch.length]);
				continue;
			}

		skippedSubStrings = skippedSubStrings.sort((a, b) => a[0] - b[0]);

		// Check first line
		checkNewline({ endIndex: 0 });
		// Check subsequent lines
		styleSearch({ source: rootString, target: ['\n'], comments: 'check' }, (match) =>
			checkNewline(match),
		);

		/**
		 * @param {number} index
		 */
		function complain(index) {
			report({
				index,
				result,
				ruleName,
				message: messages.expected(primary),
				node: root,
			});
		}

		/**
		 * @param {number} start
		 * @param {number} end
		 */
		function tryToPopSubString(start, end) {
			const [startSubString, endSubString] = skippedSubStrings[skippedSubStringsIndex];

			// Excluded substring does not presented in current line
			if (end < startSubString) {
				return 0;
			}

			// Compute excluded substring size regarding to current line indexes
			const excluded = Math.min(end, endSubString) - Math.max(start, startSubString);

			// Current substring is out of range for next lines
			if (endSubString <= end) {
				skippedSubStringsIndex++;
			}

			return excluded;
		}

		/**
		 * @param {import('style-search').StyleSearchMatch | { endIndex: number }} match
		 */
		function checkNewline(match) {
			let nextNewlineIndex = rootString.indexOf('\n', match.endIndex);

			if (rootString[nextNewlineIndex - 1] === '\r') {
				nextNewlineIndex -= 1;
			}

			// Accommodate last line
			if (nextNewlineIndex === -1) {
				nextNewlineIndex = rootString.length;
			}

			const rawLineLength = nextNewlineIndex - match.endIndex;
			const excludedLength = skippedSubStrings[skippedSubStringsIndex]
				? tryToPopSubString(match.endIndex, nextNewlineIndex)
				: 0;
			const lineText = rootString.slice(match.endIndex, nextNewlineIndex);

			// Case sensitive ignorePattern match
			if (optionsMatches(secondaryOptions, 'ignorePattern', lineText)) {
				return;
			}

			// If the line's length is less than or equal to the specified
			// max, ignore it ... So anything below is liable to be complained about.
			// **Note that the length of any url arguments or import urls
			// are excluded from the calculation.**
			if (rawLineLength - excludedLength <= primary) {
				return;
			}

			const complaintIndex = nextNewlineIndex - 1;

			if (ignoreComments) {
				if ('insideComment' in match && match.insideComment) {
					return;
				}

				// This trimming business is to notice when the line starts a
				// comment but that comment is indented, e.g.
				//       /* something here */
				const nextTwoChars = rootString.slice(match.endIndex).trim().slice(0, 2);

				if (nextTwoChars === '/*' || nextTwoChars === '//') {
					return;
				}
			}

			if (ignoreNonComments) {
				if ('insideComment' in match && match.insideComment) {
					return complain(complaintIndex);
				}

				// This trimming business is to notice when the line starts a
				// comment but that comment is indented, e.g.
				//       /* something here */
				const nextTwoChars = rootString.slice(match.endIndex).trim().slice(0, 2);

				if (nextTwoChars !== '/*' && nextTwoChars !== '//') {
					return;
				}

				return complain(complaintIndex);
			}

			// If there are no spaces besides initial (indent) spaces, ignore it
			const lineString = rootString.slice(match.endIndex, nextNewlineIndex);

			if (!lineString.replace(/^\s+/, '').includes(' ')) {
				return;
			}

			return complain(complaintIndex);
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
