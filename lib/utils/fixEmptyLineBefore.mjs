import { assert } from './validateTypes.mjs';

/** @typedef {import('stylelint').Range} Range */
/** @typedef {import('postcss').Node} Node */
/** @typedef {(node: Node, newline: string) => Node} Callback */

/**
 * fix callback for *-empty-line-before rules
 * @param {object} o
 * @param {Node} o.node
 * @param {string=} o.newline
 * @param {Callback} o.mutate
 * @param {Range} [o.range]
 * @returns {Range}
 */
export default ({ node, newline, mutate, range }) => {
	let count;

	switch (mutate.name) {
		case 'addEmptyLineBefore':
			count = !/\r?\n/.test(node.raws.before) ? -2 : -1;
			break;
		case 'removeEmptyLinesBefore':
			count = (node.raws.before.match(/\n/g) || []).length - 1;
			assert(count > 0);
			break;
		default:
			throw new Error('unknown mutate function');
	}

	assert(newline);
	mutate(node, newline);

	range = range || node.rangeBy({ word: node.toString() });
	range.start.line -= count;
	range.end.line -= count;

	return range;
};
