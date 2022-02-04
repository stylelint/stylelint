'use strict';

const isStandardSyntaxDeclaration = require('../utils/isStandardSyntaxDeclaration');
const isStandardSyntaxProperty = require('../utils/isStandardSyntaxProperty');
const report = require('../utils/report');
const styleSearch = require('style-search');

/**
 * @param {{
 *   root: import('postcss').Root,
 *   result: import('stylelint').PostcssResult,
 *   locationChecker: (opts: { source: string, index: number, err: (msg: string) => void }) => void,
 *   checkedRuleName: string,
 *   fix?: ((node: import('postcss').Declaration, index: number) => void) | null,
 *   determineIndex?: (declString: string, match: import('style-search').StyleSearchMatch) => number | false,
 * }} opts
 */
module.exports = function valueListCommaWhitespaceChecker(opts) {
	opts.root.walkDecls((decl) => {
		if (!isStandardSyntaxDeclaration(decl) || !isStandardSyntaxProperty(decl.prop)) {
			return;
		}

		const declString = decl.toString();

		styleSearch(
			{
				source: declString,
				target: ',',
				functionArguments: 'skip',
			},
			(match) => {
				const indexToCheckAfter = opts.determineIndex
					? opts.determineIndex(declString, match)
					: match.startIndex;

				if (indexToCheckAfter === false) {
					return;
				}

				checkComma(declString, indexToCheckAfter, decl);
			},
		);
	});

	/**
	 * @param {string} source
	 * @param {number} index
	 * @param {import('postcss').Declaration} node
	 * @returns {void}
	 */
	function checkComma(source, index, node) {
		opts.locationChecker({
			source,
			index,
			err: (message) => {
				if (opts.fix && opts.fix(node, index)) {
					return;
				}

				report({
					message,
					node,
					index,
					result: opts.result,
					ruleName: opts.checkedRuleName,
				});
			},
		});
	}
};
