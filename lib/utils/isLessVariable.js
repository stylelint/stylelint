/* @flow */
'use strict';

const hasBlock = require('./hasBlock');

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {boolean}
 */
module.exports = function(atRule /*: Object*/) /*: boolean*/ {
	// @ts-ignore TODO TYPES LESS property variable does not exists in types
	return (atRule.type === 'atrule' && atRule.variable && !hasBlock(atRule)) || false;
};
