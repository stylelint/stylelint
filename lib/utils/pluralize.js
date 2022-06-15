'use strict';

/**
 * Returns the plural form of the given word.
 *
 * @param {string} singular
 * @param {number} count
 * @returns {string}
 */
module.exports = function pluralize(singular, count) {
	return count === 1 ? singular : `${singular}s`;
};
