'use strict';

/**
 * Check if a statement has an block (empty or otherwise).
 *
 * @param {import('postcss').Container} statement
 * @return {boolean} True if `statement` has a block (empty or otherwise)
 */
module.exports = function hasBlock(statement) {
	return statement.nodes !== undefined;
};
