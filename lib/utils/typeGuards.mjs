/** @import { Node as PostcssNode } from 'postcss' */
/** @import { Node as ValueNode } from 'postcss-value-parser' */
/** @import { Maybe } from 'stylelint' */

/**
 * @param {Maybe<PostcssNode>} node
 * @returns {node is import('postcss').Root}
 */
export function isRoot(node) {
	return node?.type === 'root';
}

/**
 * @param {Maybe<PostcssNode>} node
 * @returns {node is import('postcss').Rule}
 */
export function isRule(node) {
	return node?.type === 'rule';
}

/**
 * @param {Maybe<PostcssNode>} node
 * @returns {node is import('postcss').AtRule}
 */
export function isAtRule(node) {
	return node?.type === 'atrule';
}

/**
 * @param {Maybe<PostcssNode>} node
 * @returns {node is import('postcss').Comment}
 */
export function isComment(node) {
	return node?.type === 'comment';
}

/**
 * @param {Maybe<PostcssNode>} node
 * @returns {node is import('postcss').Declaration}
 */
export function isDeclaration(node) {
	return node?.type === 'decl';
}

/**
 * @param {Maybe<PostcssNode>} node
 * @returns {node is import('postcss').Document}
 */
export function isDocument(node) {
	return node?.type === 'document';
}

/**
 * @param {Maybe<ValueNode>} node
 * @returns {node is import('postcss-value-parser').DivNode}
 */
export function isValueDiv(node) {
	return node?.type === 'div';
}

/**
 * @param {Maybe<ValueNode>} node
 * @returns {node is import('postcss-value-parser').FunctionNode}
 */
export function isValueFunction(node) {
	return node?.type === 'function';
}

/**
 * @param {Maybe<ValueNode>} node
 * @returns {node is import('postcss-value-parser').SpaceNode}
 */
export function isValueSpace(node) {
	return node?.type === 'space';
}

/**
 * @param {Maybe<ValueNode>} node
 * @returns {node is import('postcss-value-parser').StringNode}
 */
export function isValueString(node) {
	return node?.type === 'string';
}

/**
 * @param {Maybe<ValueNode>} node
 * @returns {node is import('postcss-value-parser').CommentNode}
 */
export function isValueComment(node) {
	return node?.type === 'comment';
}

/**
 * @param {Maybe<ValueNode>} node
 * @returns {node is import('postcss-value-parser').WordNode}
 */
export function isValueWord(node) {
	return node?.type === 'word';
}

/**
 * @param {Maybe<PostcssNode>} node
 * @returns {node is (PostcssNode & {source: import('postcss').Source})}
 */
export function hasSource(node) {
	return Boolean(node?.source);
}
