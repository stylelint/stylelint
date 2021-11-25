'use strict';

const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const { default: IntervalTree } = require('@flatten-js/interval-tree');
const validateOptions = require('../../utils/validateOptions');
const { isNumber } = require('../../utils/validateTypes');

const ruleName = 'max-empty-lines';

const messages = ruleMessages(ruleName, {
	expected: (max) => `Expected no more than ${max} empty ${max === 1 ? 'line' : 'lines'}`,
});

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
					ignore: ['comments'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const ignoreComments = optionsMatches(secondaryOptions, 'ignore', 'comments');
		const getChars = replaceEmptyLines.bind(null, primary);

		/**
		 * 1. walk nodes & replace enterchar
		 * 2. deal with special case.
		 */
		if (context.fix) {
			root.walk((node) => {
				if (node.type === 'comment' && !ignoreComments) {
					node.raws.left = getChars(node.raws.left);
					node.raws.right = getChars(node.raws.right);
				}

				if (node.raws.before) {
					node.raws.before = getChars(node.raws.before);
				}
			});

			// first node
			const firstNodeRawsBefore = root.first && root.first.raws.before;
			// root raws
			const rootRawsAfter = root.raws.after;

			// not document node
			// @ts-expect-error -- TS2339: Property 'document' does not exist on type 'Root'.
			if ((root.document && root.document.constructor.name) !== 'Document') {
				if (firstNodeRawsBefore) {
					root.first.raws.before = getChars(firstNodeRawsBefore, true);
				}

				if (rootRawsAfter) {
					// when max setted 0, should be treated as 1 in this situation.
					root.raws.after = replaceEmptyLines(primary === 0 ? 1 : primary, rootRawsAfter, true);
				}
			} else if (rootRawsAfter) {
				// `css in js` or `html`
				root.raws.after = replaceEmptyLines(primary === 0 ? 1 : primary, rootRawsAfter);
			}

			return;
		}

		let emptyLines = 0;
		const rootString = root.toString();
		/** @type {IntervalTree<boolean>} */
		const commentRanges = new IntervalTree();

		if (ignoreComments) {
			root.walkComments((comment) => {
				const start = comment.source && comment.source.start;
				const end = comment.source && comment.source.end; // end is inclusive, unlike most other ranges

				if (!start || !end) {
					return;
				}

				commentRanges.insert([start.offset, end.offset + 1], true);
			});
		}

		/** @type {[number, number][]} */
		const violatedRanges = [];
		/** @type {[number, number]} */
		let range = [0, 0];

		const emptyLineRegex = /^.*\r?\n/gm;
		const matches = rootString.matchAll(emptyLineRegex);

		for (const { 0: line, index } of matches) {
			if (index === undefined) {
				continue;
			}

			if (ignoreComments) {
				const isInComment = commentRanges.search([index, index]).length > 0;

				if (isInComment) {
					emptyLines = 0;

					return;
				}
			}

			if (line.trim() === '') {
				if (emptyLines === 0) {
					range = [index, index];
				}

				emptyLines++;
			} else {
				if (emptyLines > primary) {
					range[1] = index;
					violatedRanges.push(range);
				}

				emptyLines = 0;
			}
		}

		if (emptyLines !== 0 && emptyLines + 1 > primary) {
			range[1] = rootString.length;
			violatedRanges.push(range);
		}

		for (const [index, endIndex] of violatedRanges) {
			report({
				message: messages.expected(primary),
				node: root,
				index,
				endIndex,
				result,
				ruleName,
			});
		}

		/**
		 * @param {number} maxLines
		 * @param {unknown} str
		 * @param {boolean?} isSpecialCase
		 */
		function replaceEmptyLines(maxLines, str, isSpecialCase = false) {
			const repeatTimes = isSpecialCase ? maxLines : maxLines + 1;

			if (repeatTimes === 0 || typeof str !== 'string') {
				return '';
			}

			const emptyLinesRegex = /(^.*\r?\n)+/gm;
			const emptyLFLines = '\n'.repeat(repeatTimes);
			const emptyCRLFLines = '\r\n'.repeat(repeatTimes);

			return str.replace(emptyLinesRegex, (match) => {
				if (match.split('\n').length <= repeatTimes) {
					return match;
				}

				return match.includes('\r\n') ? emptyCRLFLines : emptyLFLines;
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
