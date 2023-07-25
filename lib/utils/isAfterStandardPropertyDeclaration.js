'use strict';

const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode');
const isCustomProperty = require('./isCustomProperty');
const isStandardSyntaxDeclaration = require('./isStandardSyntaxDeclaration');
const { isDeclaration } = require('./typeGuards.cjs');

/**
 * @param {import('postcss').Node} node
 */
module.exports = function isAfterStandardPropertyDeclaration(node) {
	const prevNode = getPreviousNonSharedLineCommentNode(node);

	return (
		prevNode !== undefined &&
		isDeclaration(prevNode) &&
		isStandardSyntaxDeclaration(prevNode) &&
		!isCustomProperty(prevNode.prop || '')
	);
};
