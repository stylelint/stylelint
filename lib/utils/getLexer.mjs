/**
 * @param {import('stylelint').StylelintPostcssResult} stylelint
 * @returns {import('css-tree').Lexer}
 */
export default function getLexer(stylelint) {
	if (!stylelint?.lexer) {
		throw new Error('Expected a "lexer" object');
	}

	return stylelint.lexer;
}
