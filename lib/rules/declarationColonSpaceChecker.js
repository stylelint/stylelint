'use strict';

const declarationValueIndex = require('../utils/declarationValueIndex');
const isStandardSyntaxDeclaration = require('../utils/isStandardSyntaxDeclaration');
const report = require('../utils/report');

/** @typedef {(args: { source: string, index: number, lineCheckStr: string, err: (message: string) => void }) => void} LocationChecker */

/**
 * @param {{
 *   root: import('postcss').Root,
 *   check: 'after' | 'before',
 *   checker: import('../utils/whitespaceChecker').WhitespaceCheckers,
 *   fix: ((decl: import('postcss').Declaration, index: number) => boolean) | null,
 *   result: import('stylelint').PostcssResult,
 *   checkedRuleName: string,
 * }} opts
 */
module.exports = function declarationColonSpaceChecker(opts) {
	const locationChecker = opts.checker[opts.check];

	opts.root.walkDecls((decl) => {
		if (!isStandardSyntaxDeclaration(decl)) {
			return;
		}

		// Get the raw prop, and only the prop
		const endOfPropIndex = declarationValueIndex(decl) + (decl.raws.between || '').length - 1;

		// The extra characters tacked onto the end ensure that there is a character to check
		// after the colon. Otherwise, with `background:pink` the character after the
		const propPlusColon = `${decl.toString().slice(0, endOfPropIndex)}xxx`;

		for (let i = 0, l = propPlusColon.length; i < l; i++) {
			if (propPlusColon[i] !== ':') {
				continue;
			}

			locationChecker({
				source: propPlusColon,
				index: i,
				lineCheckStr: decl.value,
				err: (message) => {
					if (opts.fix && opts.fix(decl, i)) {
						return;
					}

					const [index, endIndex] = opts.check === 'after' ? [i, endOfPropIndex] : [0, i + 1];

					report({
						message,
						node: decl,
						index,
						endIndex,
						result: opts.result,
						ruleName: opts.checkedRuleName,
					});
				},
			});
			break;
		}
	});
};
