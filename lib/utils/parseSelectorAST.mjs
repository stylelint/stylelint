import selectorParser from 'postcss-selector-parser';

/**
 * @param {string} selector
 * @param {import('stylelint').PostcssResult} result
 * @param {import('postcss').Node} node
 * @returns {import('postcss-selector-parser').Root | undefined}
 */
export default function parseSelectorAST(selector, result, node) {
	if (!selector) return undefined;

	try {
		return selectorParser().astSync(selector);
	} catch (err) {
		result.warn(`Cannot parse selector (${err})`, { node, stylelintType: 'parseError' });

		return undefined;
	}
}
