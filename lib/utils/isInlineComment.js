'use strict';

/** @typedef {import('postcss').Comment} Comment */
/** @typedef {import('postcss-less').Comment} LessComment */
/** @typedef {Comment & { raws: { inline?: boolean } }} SassComment */

/**
 * @param {Comment | LessComment | SassComment} comment
 * @returns {boolean}
 */
module.exports = function isInlineComment(comment) {
	// We check both here because the Sass parser uses `raws.inline` to indicate
	// inline comments, while the Less parser uses `inline`.
	if ('inline' in comment) return comment.inline;

	if ('inline' in comment.raws) return Boolean(comment.raws.inline);

	return false;
};
