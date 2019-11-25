'use strict';

/** @typedef {import('postcss').Node} Node */
/** @typedef {import('postcss').Node} NodeSource */

/**
 * @param {Node} node
 * @returns {node is import('postcss').Root}
 */
module.exports.isRoot = function isRoot(node) {
	return node.type === 'root';
};

/**
 * @param {Node} node
 * @returns {node is import('postcss').Comment}
 */
module.exports.isComment = function isComment(node) {
	return node.type === 'comment';
};

/**
 * @param {Node} node
 * @returns {node is (Node & {source: NodeSource})}
 */
module.exports.hasSource = function isComment(node) {
	return !!node.source;
};
