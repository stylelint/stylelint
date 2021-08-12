'use strict';

/**
 * @param {import('postcss').Comment} comment
 * @returns {boolean}
 */
module.exports = function isStandardSyntaxComment(comment) {
	// We check both here because the Sass parser uses `raws.inline` to indicate
	// inline comments, while the Less parser uses `inline`.
	if ('inline' in comment) return false;

	if ('inline' in comment.raws) return false;

	return true;
};
