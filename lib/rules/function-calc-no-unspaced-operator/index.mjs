import {
	TokenNode,
	WhitespaceNode,
	isCommentNode,
	isFunctionNode,
	isSimpleBlockNode,
	isTokenNode,
	isWhitespaceNode,
	parseListOfComponentValues,
	stringify,
	walk,
} from '@csstools/css-parser-algorithms';
import {
	TokenType,
	isTokenComma,
	isTokenDelim,
	isTokenDimension,
	isTokenIdent,
	isTokenNumeric,
	isTokenOpenCurly,
	isTokenOpenParen,
	isTokenSemicolon,
	mutateIdent,
	mutateUnit,
	tokenize,
} from '@csstools/css-tokenizer';

import declarationValueIndex from '../../utils/declarationValueIndex.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import { mathFunctions } from '../../reference/functions.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setDeclarationValue from '../../utils/setDeclarationValue.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

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

const MATH_FUNCS_REGEX_SOURCE = [...mathFunctions].join('|');
const FUNC_NAMES_REGEX = new RegExp(`^(?:${MATH_FUNCS_REGEX_SOURCE})$`, 'i');
const FUNC_CALLS_REGEX = new RegExp(`(?:${MATH_FUNCS_REGEX_SOURCE})\\(`, 'i');

const NEWLINE_REGEX = /\n|\r\n/;

/**
 * @typedef {import ('@csstools/css-parser-algorithms').ComponentValue} ComponentValue
 * @typedef {import ('@csstools/css-parser-algorithms').ContainerNode} ContainerNode
 */

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		/**
		 * @param {string} message
		 * @param {import('postcss').Node} node
		 * @param {number} index
		 * @param {string} operator
		 */
		function complain(message, node, index, operator) {
			const endIndex = index + operator.length;

			report({ message, node, index, endIndex, result, ruleName });
		}

		root.walkDecls((decl) => {
			const value = getDeclarationValue(decl);

			if (!OPERATOR_REGEX.test(value)) return;

			if (!FUNC_CALLS_REGEX.test(value)) return;

			let needsFix = false;
			const valueIndex = declarationValueIndex(decl);

			const tokens = tokenize({ css: value });

			{
				// Step 1
				// Step 1.1
				// Re-tokenize dimensions with units containing dashes.
				// These might be typo's.
				// For example: `10px-20px` has a unit of `px-20px`
				tokens.forEach((token, i) => {
					if (!isTokenDimension(token)) return;

					const { unit } = token[4];

					if (unit.startsWith('--')) return;

					const indexOfDash = unit.indexOf('-');

					if (indexOfDash === -1) return;

					const remainder = unit.slice(indexOfDash);

					if (remainder.length === 1) return;

					mutateUnit(token, unit.slice(0, indexOfDash));
					token[3] = token[2] + token[1].length;

					const remainderTokens = tokenize({ css: remainder }).slice(0, -1); // Trim EOF token

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
					if (!isTokenDelim(currentToken) || currentToken[4].value !== '#') return;

					const nextToken = tokens[i + 1];

					if (!isTokenOpenCurly(nextToken)) return;

					const nextNextToken = tokens[i + 2];

					if (!isTokenDelim(nextNextToken) || nextNextToken[4].value !== '$') return;

					// Set the string representation of the open curly to `#{`
					nextToken[1] = '#{';
					// Remove the `#` token
					tokens.splice(i, 1);
				});
			}

			const nodes = parseListOfComponentValues(tokens);

			if (nodes.length === 0) return;

			/**
			 * @param {ContainerNode} node
			 * @param {CompleteOperation} operation
			 */
			function checkCompleteOperation(node, operation) {
				if (operation.before.length && operation.after.length) return;

				if (!operation.before.find(isWhitespaceNode)) {
					if (context.fix) {
						needsFix = true;
						node.value.splice(
							node.value.indexOf(operation.operator),
							0,
							new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
						);
					} else {
						complain(
							messages.expectedBefore(operation.operatorToken[4].value),
							decl,
							valueIndex + operation.operatorToken[2],
							operation.operatorToken[4].value,
						);
					}
				}

				if (!operation.after.find(isWhitespaceNode)) {
					if (context.fix) {
						needsFix = true;
						node.value.splice(
							node.value.indexOf(operation.operator) + 1,
							0,
							new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
						);
					} else {
						complain(
							messages.expectedAfter(operation.operatorToken[4].value),
							decl,
							valueIndex + operation.operatorToken[2],
							operation.operatorToken[4].value,
						);
					}
				}
			}

			/**
			 * @param {Operation} operation
			 * @param {import('@csstools/css-tokenizer').CSSToken} token
			 * @param {string} operator
			 * @returns {asserts operation is CompleteOperation}
			 */
			function fixOperationWithoutOperator(operation, token, operator) {
				operation.operatorToken = [
					TokenType.Delim,
					operator,
					token[3],
					token[3] + 1,
					{ value: operator },
				];
				operation.operator = new TokenNode(operation.operatorToken);
				operation.after = operation.before;
				operation.before = [];
			}

			/**
			 * @param {ContainerNode} node
			 * @param {Operation} operation
			 */
			function checkOperationWithoutOperator(node, operation) {
				if (isTokenNode(operation.firstOperand)) {
					const token = operation.firstOperand.value;

					if (isTokenDimension(token)) {
						const { unit } = token[4];
						const operatorChar = unit.slice(-1);

						if (operatorChar && OPERATOR_REGEX.test(operatorChar)) {
							fixOperationWithoutOperator(operation, token, operatorChar);

							if (context.fix) {
								needsFix = true;

								node.value.splice(
									node.value.indexOf(operation.firstOperand) + 1,
									0,
									operation.operator,
								);

								mutateUnit(token, unit.slice(0, -1));
							}

							return;
						}
					}

					if (isTokenIdent(token)) {
						const { value: tokenValue } = token[4];
						const operatorChar = tokenValue.slice(-1);

						if (operatorChar && OPERATOR_REGEX.test(operatorChar)) {
							fixOperationWithoutOperator(operation, token, operatorChar);

							if (context.fix) {
								needsFix = true;

								node.value.splice(
									node.value.indexOf(operation.firstOperand) + 1,
									0,
									operation.operator,
								);

								mutateIdent(token, tokenValue.slice(0, -1));
							}

							return;
						}
					}
				}

				if (isTokenNode(operation.secondOperand) && isTokenNumeric(operation.secondOperand.value)) {
					const token = operation.secondOperand.value;
					const { signCharacter: operatorChar } = token[4];

					if (operatorChar && OPERATOR_REGEX.test(operatorChar)) {
						operation.operatorToken = [
							TokenType.Delim,
							operatorChar,
							token[2],
							token[3],
							{ value: operatorChar },
						];
						operation.operator = new TokenNode(operation.operatorToken);

						if (context.fix) {
							needsFix = true;

							node.value.splice(node.value.indexOf(operation.secondOperand), 0, operation.operator);

							token[4].signCharacter = undefined;
							token[1] = token[1].slice(1);
						}
					}
				}
			}

			/**
			 * @param {CompleteOperation} operation
			 * @param {CompleteOperation["before"] | CompleteOperation["after"]} whitespaceNodes
			 * @param {'before' | 'after'} position
			 */
			function checkOperandWhitespace(operation, whitespaceNodes, position) {
				whitespaceNodes.forEach((whitespaceNode) => {
					if (!isWhitespaceNode(whitespaceNode)) return;

					const whitespace = whitespaceNode.toString();

					if (whitespace === ' ') return;

					const indexOfFirstNewLine = whitespace.search(NEWLINE_REGEX);

					if (indexOfFirstNewLine === 0) return;

					if (context.fix) {
						needsFix = true;

						whitespaceNode.value = [
							[
								TokenType.Whitespace,
								indexOfFirstNewLine === -1 ? ' ' : whitespace.slice(indexOfFirstNewLine),
								-1,
								-1,
								undefined,
							],
						];
					} else {
						const message =
							position === 'before' ? messages.expectedBefore : messages.expectedAfter;

						complain(
							message(operation.operatorToken[4].value),
							decl,
							valueIndex + operation.operatorToken[2],
							operation.operatorToken[4].value,
						);
					}
				});
			}

			walk(
				nodes,
				({ node, state }) => {
					if (!state) return;

					// Step 2
					// Make sure that we are in a math context.
					// Once in a math context we remain in one until we encounter a non-math function.
					// Simple blocks with parentheses are the same as `calc()`
					if (isFunctionNode(node)) {
						state.inMathFunction = FUNC_NAMES_REGEX.test(node.getName().toLowerCase());
					} else if (!isSimpleBlockNode(node) || !isTokenOpenParen(node.startToken)) {
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
						if (isOperationWithoutOperator(operation)) {
							checkOperationWithoutOperator(node, operation);
						}

						// Step 5
						// If the operation is complete, ensure there is whitespace around the operator
						// The operation might have started without an operator and might have been repaired by Step 4
						if (isCompleteOperation(operation)) {
							checkCompleteOperation(node, operation);

							// Step 6
							// Normalize the whitespace around the operands
							checkOperandWhitespace(operation, operation.before, 'before');
							checkOperandWhitespace(operation, operation.after, 'after');
						}

						cursor = node.value.indexOf(operation.secondOperand);
					}
				},
				{
					inMathFunction: false,
				},
			);

			if (needsFix) {
				setDeclarationValue(decl, stringify([nodes]));
			}
		});
	};
};

/** @see https://drafts.csswg.org/css-values/#typedef-calc-value */
const OPERAND_TOKEN_TYPES = new Set([
	TokenType.Number,
	TokenType.Dimension,
	TokenType.Percentage,
	TokenType.Ident,
]);

/**
 * @param {ComponentValue | undefined} node
 * @returns {boolean}
 */
function isOperandNode(node) {
	if (isSimpleBlockNode(node)) return true;

	if (isFunctionNode(node)) {
		const name = node.getName().toLowerCase();

		if (mathFunctions.has(name) || name === 'var') return true;

		return false;
	}

	if (!isTokenNode(node)) return false;

	return OPERAND_TOKEN_TYPES.has(node.value[0]);
}

/**
 * NOTE: this is messy.
 *
 * @typedef {{
 *   firstOperand: ComponentValue,
 *   before: Array<ComponentValue>,
 *   secondOperand: ComponentValue,
 *   after: Array<ComponentValue>,
 *   operator: ComponentValue | undefined,
 *   operatorToken: import ('@csstools/css-tokenizer').TokenDelim | undefined,
 * }} Operation
 *
 * @typedef {{
 *   firstOperand: ComponentValue,
 *   before: Array<ComponentValue>,
 *   secondOperand: ComponentValue,
 *   after: Array<ComponentValue>,
 *   operator: ComponentValue,
 *   operatorToken: import ('@csstools/css-tokenizer').TokenDelim,
 * }} CompleteOperation
 */

/**
 * @param {Operation} operation
 * @returns {operation is CompleteOperation}
 */
function isCompleteOperation(operation) {
	return (
		Boolean(operation.firstOperand) &&
		Boolean(operation.secondOperand) &&
		Boolean(operation.operator) &&
		Boolean(operation.operatorToken)
	);
}

/**
 * @param {Operation} operation
 * @returns {operation is Operation}
 */
function isOperationWithoutOperator(operation) {
	return (
		Boolean(operation.firstOperand) &&
		Boolean(operation.secondOperand) &&
		!operation.operator &&
		!operation.operatorToken
	);
}

/**
 * @param {ContainerNode} container
 * @param {number} cursor
 * @returns {[Operation | undefined, number]}
 */
function parseOperation(container, cursor) {
	/** @type {ComponentValue | undefined} */
	let firstOperand = undefined;
	/** @type {ComponentValue | undefined} */
	let secondOperand = undefined;
	/** @type {Array<ComponentValue>} */
	const before = [];
	/** @type {Array<ComponentValue>} */
	const after = [];
	/** @type {ComponentValue | undefined} */
	let operator = undefined;
	/** @type {import ('@csstools/css-tokenizer').TokenDelim | undefined} */
	let operatorToken = undefined;

	/** @type {(node: unknown) => node is (WhitespaceNode | import('@csstools/css-parser-algorithms').CommentNode)} */
	const isBeingSkipped = (node) => isWhitespaceNode(node) || isCommentNode(node);

	let currentNode = container.value[cursor];

	// Consume as much whitespace and comments as possible
	while (isBeingSkipped(currentNode)) {
		currentNode = container.value[++cursor];
	}

	// If the current node is an operand, consume it
	if (isOperandNode(currentNode)) {
		firstOperand = currentNode;

		currentNode = container.value[++cursor];
	}

	// Consume as much whitespace and comments as possible
	// Assign to `before`
	while (isBeingSkipped(currentNode)) {
		before.push(currentNode);

		currentNode = container.value[++cursor];
	}

	// If the current node is an operator, consume it
	if (
		isTokenNode(currentNode) &&
		isTokenDelim(currentNode.value) &&
		OPERATORS.has(currentNode.value[4].value)
	) {
		operator = currentNode;
		operatorToken = currentNode.value;

		currentNode = container.value[++cursor];
	}

	// Consume as much whitespace and comments as possible
	// Assign to `after`
	while (isBeingSkipped(currentNode)) {
		after.push(currentNode);

		currentNode = container.value[++cursor];
	}

	// If the current node is an operand, consume it
	if (isOperandNode(currentNode)) {
		secondOperand = currentNode;

		currentNode = container.value[++cursor];
	}

	// Consume as much whitespace and comments as possible
	while (isBeingSkipped(currentNode)) {
		currentNode = container.value[++cursor];
	}

	// If we have not consumed any operands, we are not in an operation
	// Do error recovery by consuming until the next comma or semicolon
	// If no comma or semicolon is found, consume until the end of the container
	if (!firstOperand || !secondOperand) {
		while (currentNode) {
			if (
				isTokenNode(currentNode) &&
				(isTokenComma(currentNode.value) || isTokenSemicolon(currentNode.value))
			) {
				return [undefined, cursor];
			}

			currentNode = container.value[++cursor];
		}

		return [undefined, container.value.length];
	}

	return [
		{
			firstOperand,
			before,
			secondOperand,
			after,
			operator,
			operatorToken,
		},
		cursor,
	];
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
