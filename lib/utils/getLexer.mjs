/**
 * @param {import('stylelint').RuleContext} context
 * @returns {import('css-tree').Lexer}
 */
export default function getLexer(context) {
	if (!context?.lexer) {
		throw new Error('Expected a "lexer" object');
	}

	return context.lexer;
}
