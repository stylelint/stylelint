'use strict';

const getPreviousNonSharedLineCommentNode = require('./getPreviousNonSharedLineCommentNode');
const isCustomProperty = require('./isCustomProperty');
const isStandardSyntaxDeclaration = require('./isStandardSyntaxDeclaration');

/**
 * @param {import('postcss').Node} node
 */
module.exports = function (node) {
	const prevNode = getPreviousNonSharedLineCommentNode(node);

	return (
		prevNode !== undefined &&
		prevNode.type === 'decl' &&
		isStandardSyntaxDeclaration(prevNode) &&
		!isCustomProperty(prevNode.prop || '')
	);
};
