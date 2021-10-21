'use strict';

const styleSearch = require('style-search');

const rangeOperators = ['>=', '<=', '>', '<', '='];

/** @typedef {import('style-search').StyleSearchMatch} StyleSearchMatch */

/**
 * @template {import('postcss').AtRule} T
 * @param {T} atRule
 * @param {(match: StyleSearchMatch, params: string, atRule: T) => void} cb
 */
module.exports = function findMediaOperator(atRule, cb) {
	if (atRule.name.toLowerCase() !== 'media') {
		return;
	}

	const params = atRule.raws.params ? atRule.raws.params.raw : atRule.params;

	styleSearch({ source: params, target: rangeOperators }, (match) => {
		const before = params[match.startIndex - 1];

		if (before === '>' || before === '<') {
			return;
		}

		cb(match, params, atRule);
	});
};
