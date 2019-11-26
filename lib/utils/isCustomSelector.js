/* @flow */
'use strict';

/**
 * Check whether a selector is a custom one
 *
 * @param {string} selector
 * @returns {boolean}
 */
module.exports = function(selector /*: string*/) /*: boolean*/ {
	return selector.slice(0, 3) === ':--';
};
