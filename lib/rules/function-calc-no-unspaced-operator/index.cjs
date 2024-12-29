// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const cssParserAlgorithms = require('@csstools/css-parser-algorithms');
const cssTokenizer = require('@csstools/css-tokenizer');
const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const getDeclarationValue = require('../../utils/getDeclarationValue.cjs');
const functions = require('../../reference/functions.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const setDeclarationValue = require('../../utils/setDeclarationValue.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const validateTypes = require('../../utils/validateTypes.cjs');

const ruleName = 'function-calc-no-unspaced-operator';

const messages = ruleMessages(ruleName, {
	expectedBefore: (operator) => `Expected single space before "${operator}" operator`,
	expectedAfter: (operator) => `Expected single space after "${operator}" operator`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/function-calc-no-unspaced-operator',
	fixable: true,
};

const OPERATORS = new Set(['+', '-']);
const OPERATOR_REGEX = /[+-]/;

const MATH_FUNCS_REGEX_SOURCE = [...functions.mathFunctions].join('|');
const FUNC_NAMES_REGEX = new RegExp(`^(?:${MATH_FUNCS_REGEX_SOURCE})$`, 'i');
const FUNC_CALLS_REGEX = new RegExp(`(?:${MATH_FUNCS_REGEX_SOURCE})\\(`, 'i');

const NEWLINE_REGEX = /\n|\r\n/;

/** @import { CommentNode, ComponentValue, ContainerNode } from '@csstools/css-parser-algorithms' */

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		/**
		 * @param {string} message
		 * @param {import('postcss').Node} node
		 * @param {number} index
		 * @param {string} operator
		 * @param {() => void} fix
		 */
		function complain(message, node, index, operator, fix) {
			const endIndex = index + operator.length;

			report.default({ message, node, index, endIndex, result, ruleName, fix });
		}

		root.walkDecls((decl) => {
			const value = getDeclarationValue(decl);

			if (!OPERATOR_REGEX.test(value)) return;

			if (!FUNC_CALLS_REGEX.test(value)) return;

			const nodes = tokenizeDeclarationValue(value);

			if (nodes.length === 0) return;

			const valueIndex = nodeFieldIndices.declarationValueIndex(decl);
			const fixDeclarationValue = () => setDeclarationValue(decl, cssParserAlgorithms.stringify([nodes]));

			/**
			 * @param {ContainerNode} node
			 * @param {Operation} operation
			 * @param {'before' | 'after'} position
			 */
			function checkCompleteOperation(node, operation, position) {
				if (operation[position].some(cssParserAlgorithms.isWhitespaceNode)) return;

				const messageKey = position === 'before' ? 'expectedBefore' : 'expectedAfter';

				complain(
					messages[messageKey](operation.operatorChar),
					decl,
					valueIndex + operation.operatorCharPosition,
					operation.operatorChar,
					() => {
						operation.insertWhitespace(node, position);
						fixDeclarationValue();
					},
				);
			}

			/**
			 * @param {ContainerNode} node
			 * @param {Operation} operation
			 */
			function checkOperationWithoutOperator(node, operation) {
				if (cssParserAlgorithms.isTokenNode(operation.firstOperand)) {
					const token = operation.firstOperand.value;

					/**
					 * @param {string | undefined} operatorChar
					 * @param {() => void} mutator
					 * @returns {boolean}
					 */
					const complainToFirstOperand = (operatorChar, mutator) => {
						if (!(operatorChar && OPERATOR_REGEX.test(operatorChar))) return false;

						const [, , , endPos] = token;

						operation.completeMissingOperator(operatorChar, endPos, 'append');

						complain(
							messages.expectedBefore(operation.operatorChar),
							decl,
							valueIndex + operation.operatorCharPosition,
							operation.operatorChar,
							() => {
								operation.insertOperatorAfterFirstOperand(node);
								mutator();
								fixDeclarationValue();
							},
						);

						return true;
					};

					if (cssTokenizer.isTokenDimension(token)) {
						// E.g. '2px+' → ['2px', '+']
						const [, , , , { unit }] = token;
						const operatorChar = unit.at(-1);
						const newUnit = unit.slice(0, -1);

						if (complainToFirstOperand(operatorChar, () => cssTokenizer.mutateUnit(token, newUnit))) {
							return;
						}
					}

					if (cssTokenizer.isTokenIdent(token)) {
						// E.g. 'id+' → ['id', '+']
						const [, , , , { value: tokenValue }] = token;
						const operatorChar = tokenValue.at(-1);
						const newTokenValue = tokenValue.slice(0, -1);

						if (complainToFirstOperand(operatorChar, () => cssTokenizer.mutateIdent(token, newTokenValue))) {
							return;
						}
					}
				}

				if (cssParserAlgorithms.isTokenNode(operation.secondOperand) && cssTokenizer.isTokenNumeric(operation.secondOperand.value)) {
					const token = operation.secondOperand.value;
					const [, , startPos, , { signCharacter: operatorChar }] = token;

					if (operatorChar && OPERATOR_REGEX.test(operatorChar)) {
						operation.completeMissingOperator(operatorChar, startPos, 'prepend');

						complain(
							messages.expectedAfter(operation.operatorChar),
							decl,
							valueIndex + operation.operatorCharPosition,
							operation.operatorChar,
							() => {
								operation.insertOperatorBeforeSecondOperand(node);

								// Remove an operator character from the second operand token
								token[4].signCharacter = undefined;
								token[1] = token[1].slice(1);

								fixDeclarationValue();
							},
						);
					}
				}
			}

			/**
			 * @param {Operation} operation
			 * @param {'before' | 'after'} position
			 */
			function checkOperandWhitespace(operation, position) {
				operation[position].forEach((whitespaceNode) => {
					if (!cssParserAlgorithms.isWhitespaceNode(whitespaceNode)) return;

					const whitespace = whitespaceNode.toString();

					if (whitespace === ' ') return;

					const indexOfFirstNewLine = whitespace.search(NEWLINE_REGEX);

					if (indexOfFirstNewLine === 0) return;

					const message = position === 'before' ? messages.expectedBefore : messages.expectedAfter;

					complain(
						message(operation.operatorChar),
						decl,
						valueIndex + operation.operatorCharPosition,
						operation.operatorChar,
						() => {
							whitespaceNode.value = newWhitespaceNode(
								indexOfFirstNewLine === -1 ? ' ' : whitespace.slice(indexOfFirstNewLine),
							).value;
							fixDeclarationValue();
						},
					);
				});
			}

			cssParserAlgorithms.walk(
				nodes,
				({ node, state }) => {
					if (!state) return;

					// Step 2
					// Make sure that we are in a math context.
					// Once in a math context we remain in one until we encounter a non-math function.
					// Simple blocks with parentheses are the same as `calc()`
					if (cssParserAlgorithms.isFunctionNode(node)) {
						state.inMathFunction = FUNC_NAMES_REGEX.test(node.getName().toLowerCase());
					} else if (!cssParserAlgorithms.isSimpleBlockNode(node) || !cssTokenizer.isTokenOpenParen(node.startToken)) {
						state.inMathFunction = false;

						return;
					}

					if (!state.inMathFunction) return;

					let cursor = 0;
					/** @type {Operation | undefined} */
					let operation = undefined;

					while (cursor !== -1 && cursor < node.value.length) {
						// Step 3
						// Parse into operations
						// Each operation consumes as much whitespace before and after
						// Each parse call tries to consume as much as possible up to the next comma or semicolon
						// Operations consist of
						// - first operand
						// - operator
						// - second operand
						// - whitespace before and after
						[operation, cursor] = parseOperation(node, cursor);

						if (!operation) {
							cursor++;
							continue;
						}

						// Step 4
						// If there is no operator, try to find one
						if (!operation.operator) {
							checkOperationWithoutOperator(node, operation);
						}

						// Step 5
						// If the operation is complete, ensure there is whitespace around the operator
						// The operation might have started without an operator and might have been repaired by Step 4
						if (operation.operator) {
							checkCompleteOperation(node, operation, 'before');
							checkCompleteOperation(node, operation, 'after');

							// Step 6
							// Normalize the whitespace around the operands
							checkOperandWhitespace(operation, 'before');
							checkOperandWhitespace(operation, 'after');
						}

						cursor = node.value.indexOf(operation.secondOperand);
					}
				},
				{
					inMathFunction: false,
				},
			);
		});
	};
};

/**
 * @param {string} value
 * @returns {Array<ComponentValue>}
 */
function tokenizeDeclarationValue(value) {
	const tokens = cssTokenizer.tokenize({ css: value });

	// Step 1
	// Step 1.1
	// Re-tokenize dimensions with units containing dashes.
	// These might be typo's.
	// For example: `10px-20px` has a unit of `px-20px`
	tokens.forEach((token, i) => {
		if (!cssTokenizer.isTokenDimension(token)) return;

		const { unit } = token[4];

		if (unit.startsWith('--')) return;

		const indexOfDash = unit.indexOf('-');

		if (indexOfDash === -1) return;

		const remainder = unit.slice(indexOfDash);

		if (remainder.length === 1) return;

		cssTokenizer.mutateUnit(token, unit.slice(0, indexOfDash));
		token[3] = token[2] + token[1].length;

		const remainderTokens = cssTokenizer.tokenize({ css: remainder }).slice(0, -1); // Trim EOF token

		remainderTokens.forEach((remainderToken) => {
			remainderToken[2] += token[3];
			remainderToken[3] += token[3];
		});

		tokens.splice(i + 1, 0, ...remainderTokens);
	});

	// Step 1.2
	// Re-tokenize scss interpolation blocks
	// Grouping `#` and `{` into a single token allows us to parse these as simple blocks with curly braces.
	// For example: `#{$foo}`
	tokens.forEach((currentToken, i) => {
		if (!cssTokenizer.isTokenDelim(currentToken) || currentToken[4].value !== '#') return;

		const nextToken = tokens[i + 1];

		if (!cssTokenizer.isTokenOpenCurly(nextToken)) return;

		const nextNextToken = tokens[i + 2];

		if (!cssTokenizer.isTokenDelim(nextNextToken) || nextNextToken[4].value !== '$') return;

		// Set the string representation of the open curly to `#{`
		nextToken[1] = '#{';
		// Remove the `#` token
		tokens.splice(i, 1);
	});

	return cssParserAlgorithms.parseListOfComponentValues(tokens);
}

/** @see https://drafts.csswg.org/css-values/#typedef-calc-value */
const OPERAND_TOKEN_TYPES = new Set([
	cssTokenizer.TokenType.Number,
	cssTokenizer.TokenType.Dimension,
	cssTokenizer.TokenType.Percentage,
	cssTokenizer.TokenType.Ident,
]);

/**
 * @param {ComponentValue | undefined} node
 * @returns {boolean}
 */
function isOperandNode(node) {
	if (cssParserAlgorithms.isSimpleBlockNode(node)) return true;

	if (cssParserAlgorithms.isFunctionNode(node)) {
		const name = node.getName().toLowerCase();

		if (functions.mathFunctions.has(name) || name === 'var') return true;

		return false;
	}

	if (!cssParserAlgorithms.isTokenNode(node)) return false;

	return OPERAND_TOKEN_TYPES.has(node.value[0]);
}

/**
 * @param {string} whitespace
 */
function newWhitespaceNode(whitespace = ' ') {
	return new cssParserAlgorithms.WhitespaceNode([[cssTokenizer.TokenType.Whitespace, whitespace, -1, -1, undefined]]);
}

class Operation {
	/**
	 * @param {ComponentValue} firstOperand
	 * @param {Array<WhitespaceNode | CommentNode>} before
	 * @param {ComponentValue} secondOperand
	 * @param {Array<WhitespaceNode | CommentNode>} after
	 * @param {TokenNode | undefined} operator
	 */
	constructor(firstOperand, before, secondOperand, after, operator) {
		/** @type {typeof firstOperand} */
		this.firstOperand = firstOperand;
		/** @type {typeof before} */
		this.before = before;
		/** @type {typeof secondOperand} */
		this.secondOperand = secondOperand;
		/** @type {typeof after} */
		this.after = after;
		/** @type {typeof operator} */
		this.operator = operator;
	}

	get #operatorToken() {
		validateTypes.assert(cssTokenizer.isTokenDelim(this.operator?.value));

		return this.operator.value;
	}

	/** @returns {string} */
	get operatorChar() {
		return this.#operatorToken[4].value;
	}

	/** @returns {number} */
	get operatorCharPosition() {
		return this.#operatorToken[2];
	}

	/**
	 * @param {ContainerNode} node
	 * @param {'before' | 'after'} position
	 */
	insertWhitespace(node, position) {
		validateTypes.assert(this.operator);
		node.value.splice(
			node.value.indexOf(this.operator) + (position === 'before' ? 0 : 1),
			0,
			newWhitespaceNode(),
		);
	}

	/**
	 * @param {ContainerNode} node
	 */
	insertOperatorAfterFirstOperand(node) {
		validateTypes.assert(this.operator);
		node.value.splice(node.value.indexOf(this.firstOperand) + 1, 0, ...this.before, this.operator);
	}

	/**
	 * @param {ContainerNode} node
	 */
	insertOperatorBeforeSecondOperand(node) {
		validateTypes.assert(this.operator);
		node.value.splice(node.value.indexOf(this.secondOperand), 0, this.operator, ...this.after);
	}

	/**
	 * @param {string} operatorChar
	 * @param {number} operatorCharPosition
	 * @param {'append' | 'prepend'} type
	 */
	completeMissingOperator(operatorChar, operatorCharPosition, type) {
		this.operator = new cssParserAlgorithms.TokenNode([
			cssTokenizer.TokenType.Delim,
			operatorChar,
			operatorCharPosition,
			operatorCharPosition + operatorChar.length,
			{ value: operatorChar },
		]);

		if (type === 'append') {
			this.after = this.before;
			this.before = [newWhitespaceNode()];
		} else {
			this.after = [newWhitespaceNode()];
		}
	}
}

/**
 * @param {ContainerNode} container
 * @param {number} cursor
 * @returns {[Operation | undefined, number]}
 */
function parseOperation(container, cursor) {
	let firstOperand = undefined;
	let secondOperand = undefined;
	const before = [];
	const after = [];
	let operator = undefined;

	let currentNode = container.value[cursor];

	// Consume as much whitespace and comments as possible
	while (cssParserAlgorithms.isWhiteSpaceOrCommentNode(currentNode)) {
		currentNode = container.value[++cursor];
	}

	// If the current node is an operand, consume it
	if (isOperandNode(currentNode)) {
		firstOperand = currentNode;

		currentNode = container.value[++cursor];
	}

	// Consume as much whitespace and comments as possible
	// Assign to `before`
	while (cssParserAlgorithms.isWhiteSpaceOrCommentNode(currentNode)) {
		before.push(currentNode);

		currentNode = container.value[++cursor];
	}

	// If the current node is an operator, consume it
	if (
		cssParserAlgorithms.isTokenNode(currentNode) &&
		cssTokenizer.isTokenDelim(currentNode.value) &&
		OPERATORS.has(currentNode.value[4].value)
	) {
		operator = currentNode;

		currentNode = container.value[++cursor];
	}

	// Consume as much whitespace and comments as possible
	// Assign to `after`
	while (cssParserAlgorithms.isWhiteSpaceOrCommentNode(currentNode)) {
		after.push(currentNode);

		currentNode = container.value[++cursor];
	}

	// If the current node is an operand, consume it
	if (isOperandNode(currentNode)) {
		secondOperand = currentNode;

		currentNode = container.value[++cursor];
	}

	// Consume as much whitespace and comments as possible
	while (cssParserAlgorithms.isWhiteSpaceOrCommentNode(currentNode)) {
		currentNode = container.value[++cursor];
	}

	// If we have not consumed any operands, we are not in an operation
	// Do error recovery by consuming until the next comma or semicolon
	// If no comma or semicolon is found, consume until the end of the container
	if (!firstOperand || !secondOperand) {
		while (currentNode) {
			if (
				cssParserAlgorithms.isTokenNode(currentNode) &&
				(cssTokenizer.isTokenComma(currentNode.value) || cssTokenizer.isTokenSemicolon(currentNode.value))
			) {
				return [undefined, cursor];
			}

			currentNode = container.value[++cursor];
		}

		return [undefined, container.value.length];
	}

	return [new Operation(firstOperand, before, secondOperand, after, operator), cursor];
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
