const { find } = require('css-tree');

/**
 * TODO: This function avoids false positives because CSSTree doesn't fully support
 * some math functions like `clamp()` via `fork()`. In the future, it may be unnecessary.
 *
 * @see https://github.com/stylelint/stylelint/pull/6511#issuecomment-1412921062
 * @see https://github.com/stylelint/stylelint/issues/6635#issuecomment-1425787649
 *
 * @param {import('css-tree').CssNode} cssTreeNode
 * @returns {boolean}
 */
module.exports = function containsUnsupportedFunction(cssTreeNode) {
	return Boolean(
		find(
			cssTreeNode,
			(node) => node.type === 'Function' && ['clamp', 'min', 'max', 'env'].includes(node.name),
		),
	);
};
