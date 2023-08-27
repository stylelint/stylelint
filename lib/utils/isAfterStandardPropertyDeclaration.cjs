'use strict';

const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode.cjs');
const isCustomProperty = require('./isCustomProperty.cjs');
const typeGuards = require('./typeGuards.cjs');
const isStandardSyntaxDeclaration = require('./isStandardSyntaxDeclaration.cjs');

/**
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
function isAfterStandardPropertyDeclaration(node) {
	const prevNode = getPreviousNonSharedLineCommentNode(node);

	return (
		prevNode !== undefined &&
		typeGuards.isDeclaration(prevNode) &&
		isStandardSyntaxDeclaration(prevNode) &&
		!isCustomProperty(prevNode.prop || '')
	);
}

module.exports = isAfterStandardPropertyDeclaration;
