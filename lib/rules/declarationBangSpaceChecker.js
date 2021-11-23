'use strict';

const declarationValueIndex = require('../utils/declarationValueIndex');
const report = require('../utils/report');
const styleSearch = require('style-search');

/** @typedef {import('postcss').Declaration} Declaration */

/** @typedef {(args: { source: string, index: number, err: (message: string) => void }) => void} LocationChecker */

/**
 * @param {{
 *   root: import('postcss').Root,
 *   locationChecker: LocationChecker,
 *   result: import('stylelint').PostcssResult,
 *   checkedRuleName: string,
 *   fix: ((decl: Declaration, index: number) => boolean) | null,
 * }} opts
 * @returns {void}
 */
module.exports = function declarationBangSpaceChecker(opts) {
	opts.root.walkDecls((decl) => {
		const indexOffset = declarationValueIndex(decl);
		const declString = decl.toString();
		const valueString = decl.toString().slice(indexOffset);

		if (!valueString.includes('!')) {
			return;
		}

		styleSearch({ source: valueString, target: '!' }, (match) => {
			const declStr = valueString.slice(match.startIndex);
			const declMatch = declStr.match(/^!\s*(\S+)\b/);

			check(declString, match.startIndex + indexOffset, declMatch ? declMatch[0].length : 1, decl);
		});
	});

	/**
	 * @param {string} source
	 * @param {number} index
	 * @param {number} length
	 * @param {Declaration} decl
	 */
	function check(source, index, length, decl) {
		opts.locationChecker({
			source,
			index,
			err: (message) => {
				if (opts.fix && opts.fix(decl, index)) {
					return;
				}

				report({
					message,
					node: decl,
					index,
					endIndex: index + length,
					result: opts.result,
					ruleName: opts.checkedRuleName,
				});
			},
		});
	}
};
