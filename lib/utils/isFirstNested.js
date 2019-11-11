/* @flow */
'use strict';

/**
 * @param {import('postcss').Node} statement
 * @returns {boolean}
 */
module.exports = function(statement /*: postcss$node*/) /*: boolean*/ {
	const parentNode = statement.parent;

	if (parentNode === undefined || parentNode.type === 'root') {
		return false;
	}

	if (statement === parentNode.first) {
		return true;
	}

	/*
	 * Search for the statement in the parent's nodes, ignoring comment
	 * nodes on the same line as the parent's opening brace.
	 */

	const parentNodes = parentNode.nodes;

	if (!parentNodes) {
		return false;
	}

	const firstNode = parentNodes[0];

	if (
		!firstNode ||
		firstNode.type !== 'comment' ||
		!firstNode.raws ||
		!firstNode.raws.before ||
		firstNode.raws.before.includes('\n') ||
		!firstNode.source ||
		!firstNode.source.start ||
		!firstNode.source.end
	) {
		return false;
	}

	const openingBraceLine = firstNode.source.start.line;

	if (openingBraceLine !== firstNode.source.end.line) {
		return false;
	}

	for (let i = 1; i < parentNodes.length; i++) {
		const node = parentNodes[i];

		if (node === statement) {
			return true;
		}

		if (
			node.type !== 'comment' ||
			!node.source ||
			!node.source.end ||
			node.source.end.line !== openingBraceLine
		) {
			return false;
		}
	}

	/* istanbul ignore next: Should always return in the loop */
	return false;
};
