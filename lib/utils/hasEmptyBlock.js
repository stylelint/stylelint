'use strict';

const hasBlock = require('./hasBlock');

/**
 * Check if a statement has an empty block.
 *
 * @param {import('postcss').Rule | import('postcss').AtRule} statement - postcss rule or at-rule node
 * @return {boolean} True if the statement has a block and it is empty
 */
module.exports = function hasEmptyBlock(statement) {
	return hasBlock(statement) && statement.nodes.length === 0;
};
