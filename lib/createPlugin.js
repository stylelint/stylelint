/* @flow */
'use strict';

/**
 * @param {string} ruleName
 * @param {Function} rule
 * @returns {{ruleName: string, rule: Function}}
 */
module.exports = function(ruleName /*: string*/, rule /*: Function*/) {
	return {
		ruleName,
		rule,
	};
};
