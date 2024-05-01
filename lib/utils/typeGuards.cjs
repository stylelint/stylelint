// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const cssTokenizer = require('@csstools/css-tokenizer');

/** @typedef {import('postcss').Node} Node */
/** @typedef {import('postcss').Source} NodeSource */

/**
 * @param {Node} node
 * @returns {node is import('postcss').Root}
 */
function isRoot(node) {
	return node.type === 'root';
}

/**
 * @param {Node} node
 * @returns {node is import('postcss').Rule}
 */
function isRule(node) {
	return node.type === 'rule';
}

/**
 * @param {Node} node
 * @returns {node is import('postcss').AtRule}
 */
function isAtRule(node) {
	return node.type === 'atrule';
}

/**
 * @param {Node} node
 * @returns {node is import('postcss').Comment}
 */
function isComment(node) {
	return node.type === 'comment';
}

/**
 * @param {Node} node
 * @returns {node is import('postcss').Declaration}
 */
function isDeclaration(node) {
	return node.type === 'decl';
}

/**
 * @param {Node} node
 * @returns {node is import('postcss').Document}
 */
function isDocument(node) {
	return node.type === 'document';
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').DivNode}
 */
function isValueDiv(node) {
	return node.type === 'div';
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').FunctionNode}
 */
function isValueFunction(node) {
	return node.type === 'function';
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').SpaceNode}
 */
function isValueSpace(node) {
	return node.type === 'space';
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').WordNode}
 */
function isValueWord({ type }) {
	return type === 'word';
}

/**
 * @param {Node} node
 * @returns {node is (Node & {source: NodeSource})}
 */
function hasSource(node) {
	return Boolean(node.source);
}

/**
 * @param {import('@csstools/css-tokenizer').CSSToken | undefined} token
 * @returns {token is import('@csstools/css-tokenizer').TokenComma}
 */
function isTokenComma(token) {
	return token !== undefined && token[0] === cssTokenizer.TokenType.Comma;
}

/**
 * @param {import('@csstools/css-tokenizer').CSSToken | undefined} token
 * @returns {token is import('@csstools/css-tokenizer').TokenDelim}
 */
function isTokenDelim(token) {
	return token !== undefined && token[0] === cssTokenizer.TokenType.Delim;
}

/**
 * @param {import('@csstools/css-tokenizer').CSSToken | undefined} token
 * @returns {token is import('@csstools/css-tokenizer').TokenDimension}
 */
function isTokenDimension(token) {
	return token !== undefined && token[0] === cssTokenizer.TokenType.Dimension;
}

/**
 * @param {import('@csstools/css-tokenizer').CSSToken | undefined} token
 * @returns {token is import('@csstools/css-tokenizer').TokenNumber}
 */
function isTokenNumber(token) {
	return token !== undefined && token[0] === cssTokenizer.TokenType.Number;
}

/**
 * @param {import('@csstools/css-tokenizer').CSSToken | undefined} token
 * @returns {token is import('@csstools/css-tokenizer').TokenOpenCurly}
 */
function isTokenOpenCurly(token) {
	return token !== undefined && token[0] === cssTokenizer.TokenType.OpenCurly;
}

/**
 * @param {import('@csstools/css-tokenizer').CSSToken | undefined} token
 * @returns {token is import('@csstools/css-tokenizer').TokenOpenParen}
 */
function isTokenOpenParen(token) {
	return token !== undefined && token[0] === cssTokenizer.TokenType.OpenParen;
}

/**
 * @param {import('@csstools/css-tokenizer').CSSToken | undefined} token
 * @returns {token is import('@csstools/css-tokenizer').TokenPercentage}
 */
function isTokenPercentage(token) {
	return token !== undefined && token[0] === cssTokenizer.TokenType.Percentage;
}

/**
 * @param {import('@csstools/css-tokenizer').CSSToken | undefined} token
 * @returns {token is import('@csstools/css-tokenizer').TokenSemicolon}
 */
function isTokenSemicolon(token) {
	return token !== undefined && token[0] === cssTokenizer.TokenType.Semicolon;
}

exports.hasSource = hasSource;
exports.isAtRule = isAtRule;
exports.isComment = isComment;
exports.isDeclaration = isDeclaration;
exports.isDocument = isDocument;
exports.isRoot = isRoot;
exports.isRule = isRule;
exports.isTokenComma = isTokenComma;
exports.isTokenDelim = isTokenDelim;
exports.isTokenDimension = isTokenDimension;
exports.isTokenNumber = isTokenNumber;
exports.isTokenOpenCurly = isTokenOpenCurly;
exports.isTokenOpenParen = isTokenOpenParen;
exports.isTokenPercentage = isTokenPercentage;
exports.isTokenSemicolon = isTokenSemicolon;
exports.isValueDiv = isValueDiv;
exports.isValueFunction = isValueFunction;
exports.isValueSpace = isValueSpace;
exports.isValueWord = isValueWord;
