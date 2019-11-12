/* @flow */
'use strict';

const hasBlock = require('./hasBlock');

module.exports = function(atRule /*: Object*/) /*: boolean*/ {
	return atRule.type === 'atrule' && atRule.variable && !hasBlock(atRule);
};
