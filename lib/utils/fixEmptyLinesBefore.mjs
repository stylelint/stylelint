import addEmptyLineBefore from './addEmptyLineBefore.mjs';
import { assert } from './validateTypes.mjs';
import removeEmptyLinesBefore from './removeEmptyLinesBefore.mjs';

/** @typedef {import('stylelint').Range} Range */
/** @typedef {import('postcss').Node} Node */

/**
 * fix callback for *-empty-line-before rules
 * @param {object} o
 * @param {Node} o.node
 * @param {string=} o.newline
 * @param {'add'|'remove'} o.action
 * @param {Range} [o.range]
 * @throws {TypeError}
 * @returns {Range}
 */
export default function fixEmptyLinesBefore({ node, newline, action, range }) {
	let lineCount;

	assert(newline);

	switch (action) {
		case 'add':
			lineCount = !/\r?\n/.test(node.raws.before) ? -2 : -1;
			addEmptyLineBefore(node, newline);
			break;
		case 'remove':
			lineCount = (node.raws.before.match(/\n/g) || []).length - 1;
			assert(lineCount > 0);
			removeEmptyLinesBefore(node, newline);
			break;
		default:
			throw new TypeError(`Unknown action ${action}`);
	}

	range = range || node.rangeBy({ word: node.toString() });
	range.start.line -= lineCount;
	range.end.line -= lineCount;

	return range;
}
