// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

/**
 * @typedef {import('css-tree').Lexer} Lexer
 */

/**
 * @param {import('stylelint').RuleContext} context
 * @returns {Lexer}
 */
function getLexer(context) {
	if (!context?.lexer) {
		throw new Error('Expected a "lexer" object');
	}

	return /** @type Lexer */ (context.lexer);
}

module.exports = getLexer;
