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
			check(declString, match.startIndex + indexOffset, decl);
		});
	});

	/**
	 * @param {string} source
	 * @param {number} index
	 * @param {Declaration} decl
	 */
	function check(source, index, decl) {
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
					result: opts.result,
					ruleName: opts.checkedRuleName,
				});
			},
		});
	}
};
