'use strict';

/**
 * Check whether a selector is a custom one
 *
 * @param {string} selector
 * @returns {boolean}
 */
function isCustomSelector(selector) {
	return selector.startsWith(':--');
}

module.exports = isCustomSelector;
