'use strict';

const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const styleSearch = require('style-search');
const validateOptions = require('../../utils/validateOptions');
const { isNumber } = require('../../utils/validateTypes');

const ruleName = 'max-empty-lines';

const messages = ruleMessages(ruleName, {
	expected: (max) => `Expected no more than ${max} empty ${max === 1 ? 'line' : 'lines'}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/max-empty-lines',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	let emptyLines = 0;
	let lastIndex = -1;

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

		emptyLines = 0;
		lastIndex = -1;
		const rootString = root.toString();

		styleSearch(
			{
				source: rootString,
				target: /\r\n/.test(rootString) ? '\r\n' : '\n',
				comments: ignoreComments ? 'skip' : 'check',
			},
			(match) => {
				checkMatch(rootString, match.startIndex, match.endIndex, root);
			},
		);

		/**
		 * @param {string} source
		 * @param {number} matchStartIndex
		 * @param {number} matchEndIndex
		 * @param {import('postcss').Root} node
		 */
		function checkMatch(source, matchStartIndex, matchEndIndex, node) {
			const eof = matchEndIndex === source.length;
			let problem = false;

			// Additional check for beginning of file
			if (!matchStartIndex || lastIndex === matchStartIndex) {
				emptyLines++;
			} else {
				emptyLines = 0;
			}

			lastIndex = matchEndIndex;

			if (emptyLines > primary) problem = true;

			if (!eof && !problem) return;

			if (problem) {
				report({
					message: messages.expected(primary),
					node,
					index: matchStartIndex,
					result,
					ruleName,
				});
			}

			// Additional check for end of file
			if (eof && primary) {
				emptyLines++;

				if (emptyLines > primary && isEofNode(result.root, node)) {
					report({
						message: messages.expected(primary),
						node,
						index: matchEndIndex,
						result,
						ruleName,
					});
				}
			}
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

			const emptyLFLines = '\n'.repeat(repeatTimes);
			const emptyCRLFLines = '\r\n'.repeat(repeatTimes);

			return /(?:\r\n)+/.test(str)
				? str.replace(/(\r\n)+/g, ($1) => {
						if ($1.length / 2 > repeatTimes) {
							return emptyCRLFLines;
						}

						return $1;
				  })
				: str.replace(/(\n)+/g, ($1) => {
						if ($1.length > repeatTimes) {
							return emptyLFLines;
						}

						return $1;
				  });
		}
	};
};

/**
 * Checks whether the given node is the last node of file.
 * @param {import('stylelint').PostcssResult['root']} document - the document node with `postcss-html` and `postcss-jsx`.
 * @param {import('postcss').Root} root - the root node of css
 */
function isEofNode(document, root) {
	if (!document || document.constructor.name !== 'Document' || !('type' in document)) {
		return true;
	}

	// In the `postcss-html` and `postcss-jsx` syntax, checks that there is text after the given node.
	let after;

	if (root === document.last) {
		after = document.raws && document.raws.codeAfter;
	} else {
		// @ts-expect-error -- TS2345: Argument of type 'Root' is not assignable to parameter of type 'number | ChildNode'.
		const rootIndex = document.index(root);

		const nextNode = document.nodes[rootIndex + 1];

		after = nextNode && nextNode.raws && nextNode.raws.codeBefore;
	}

	return !String(after).trim();
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
