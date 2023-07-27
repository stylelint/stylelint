import selectorParser from 'postcss-selector-parser';

/**
 * @param {import('stylelint').PostcssResult} result
 * @param {import('postcss').Rule} node
 * @param {(root: import('postcss-selector-parser').Root) => void} callback
 * @returns {string | undefined}
 */
export default function transformSelector(result, node, callback) {
	try {
		return selectorParser(callback).processSync(node, { updateSelector: true });
	} catch {
		result.warn('Cannot parse selector', { node, stylelintType: 'parseError' });

		return undefined;
	}
}
