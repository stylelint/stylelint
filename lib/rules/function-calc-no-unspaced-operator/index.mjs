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
import { TokenType, tokenize } from '@csstools/css-tokenizer';

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
// #7618
const alternatives = [...mathFunctions].join('|');
const FUNC_NAMES_REGEX = new RegExp(`^(?:${alternatives})$`, 'i');
const FUNC_CALLS_REGEX = new RegExp(`(?:${alternatives})\\(`, 'i');

const NEWLINE_REGEX = /\n|\r\n/;

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
				for (let i = 0; i < tokens.length; i++) {
					const token = tokens[i];

					// NOTE:
					// This is a mess, I am fairly certain that it is correct, but too much is happening with strings.
					// This will be brittle and might break when the css-tokenizer is updated.
					// It will also produce invalid CSS for exotic units, nu such units exists today.
					if (!token || token[0] !== TokenType.Dimension) continue;

					if (token[4].unit.startsWith('--')) continue;

					const indexOfDash = token[4].unit.indexOf('-');

					if (indexOfDash === -1) continue;

					const remainder = token[4].unit.slice(indexOfDash);

					if (remainder.length === 1) continue;

					token[4].unit = token[4].unit.slice(0, indexOfDash);
					token[1] = `${token[4].signCharacter === '+' ? '+' : ''}${token[4].value}${
						token[4].unit
					}`;
					token[3] = token[2] + token[1].length;

					const remainderTokens = tokenize({ css: remainder }).slice(0, -1);

					remainderTokens.forEach((remainderToken) => {
						remainderToken[2] += token[3];
						remainderToken[3] += token[3];
					});

					tokens.splice(i + 1, 0, ...remainderTokens);
				}

				// Step 1.2
				// Re-tokenize scss interpolation blocks
				// Grouping `#` and `{` into a single token allows us to parse these as simple blocks with curly braces.
				// For example: `#{$foo}`
				for (let i = 0; i < tokens.length; i++) {
					const current = tokens[i];

					if (!current || current[0] !== TokenType.Delim || current[4].value !== '#') continue;

					const plus1 = tokens[i + 1];

					if (!plus1 || plus1[0] !== TokenType.OpenCurly) continue;

					const plus2 = tokens[i + 2];

					if (!plus2 || plus2[0] !== TokenType.Delim || plus2[4].value !== '$') continue;

					// Set the string representation of the open curly to `#{`
					plus1[1] = '#{';
					// Remove the `#` token
					tokens.splice(i, 1);
				}
			}

			const nodes = parseListOfComponentValues(tokens);

			if (nodes.length === 0) return;

			/**
			 * @param {import('@csstools/css-parser-algorithms').ContainerNode} node
			 * @param {CompleteOperation} operation
			 */
			function checkCompleteOperation(node, operation) {
				if (operation.before.length && operation.after.length) return;

				if (!operation.before.length) {
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

				if (!operation.after.length) {
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
			 * @param {import('@csstools/css-parser-algorithms').ContainerNode} node
			 * @param {OperationWithoutOperator} operation
			 */
			function checkOperationWithoutOperator(node, operation) {
				if (
					isTokenNode(operation.firstOperand) &&
					operation.firstOperand.value[0] === TokenType.Dimension
				) {
					const token = operation.firstOperand.value;
					const operatorChar = operation.firstOperand.value[4].unit.slice(-1);

					if (operatorChar && OPERATOR_REGEX.test(operatorChar)) {
						operation.operatorToken = [
							TokenType.Delim,
							operatorChar,
							token[3],
							token[3] + 1,
							{ value: operatorChar },
						];
						operation.operator = new TokenNode(operation.operatorToken);
						operation.after = operation.before;
						operation.before = [];

						if (context.fix) {
							needsFix = true;

							node.value.splice(
								node.value.indexOf(operation.firstOperand) + 1,
								0,
								operation.operator,
							);

							token[4].unit = token[4].unit.slice(0, -1);
							token[1] = token[1].slice(0, -1);
						}

						return;
					}
				}

				if (
					isTokenNode(operation.secondOperand) &&
					(operation.secondOperand.value[0] === TokenType.Dimension ||
						operation.secondOperand.value[0] === TokenType.Percentage ||
						operation.secondOperand.value[0] === TokenType.Number)
				) {
					const token = operation.secondOperand.value;
					const operatorChar = token[4].signCharacter;

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
				const firstWhitespaceNode = whitespaceNodes[0];

				if (whitespaceNodes.length === 1 && isWhitespaceNode(firstWhitespaceNode)) {
					const whitespace = firstWhitespaceNode.toString();

					if (whitespace === ' ') return;

					const indexOfFirstNewLine = whitespace.search(NEWLINE_REGEX);

					if (indexOfFirstNewLine === 0) return;

					if (context.fix) {
						needsFix = true;

						firstWhitespaceNode.value = [
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
				}
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
					} else if (!isSimpleBlockNode(node) || node.startToken[0] !== TokenType.OpenParen) {
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

						if (operation.secondOperand) {
							cursor = node.value.indexOf(operation.secondOperand);
						} else {
							cursor++;
						}
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
 * @param {import('@csstools/css-parser-algorithms').ComponentValue | undefined} node
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
 *   firstOperand: import ('@csstools/css-parser-algorithms').ComponentValue | undefined,
 *   before: Array<import ('@csstools/css-parser-algorithms').ComponentValue>,
 *   secondOperand: import ('@csstools/css-parser-algorithms').ComponentValue | undefined,
 *   after: Array<import ('@csstools/css-parser-algorithms').ComponentValue>,
 *   operator: import ('@csstools/css-parser-algorithms').ComponentValue | undefined,
 *   operatorToken: import ('@csstools/css-tokenizer').TokenDelim | undefined,
 * }} Operation
 *
 * @typedef {{
 *   firstOperand: import ('@csstools/css-parser-algorithms').ComponentValue,
 *   before: Array<import ('@csstools/css-parser-algorithms').ComponentValue>,
 *   secondOperand: import ('@csstools/css-parser-algorithms').ComponentValue,
 *   after: Array<import ('@csstools/css-parser-algorithms').ComponentValue>,
 *   operator: import ('@csstools/css-parser-algorithms').ComponentValue,
 *   operatorToken: import ('@csstools/css-tokenizer').TokenDelim,
 * }} CompleteOperation
 *
 * @typedef {{
 *   firstOperand: import ('@csstools/css-parser-algorithms').ComponentValue,
 *   before: Array<import ('@csstools/css-parser-algorithms').ComponentValue>,
 *   secondOperand: import ('@csstools/css-parser-algorithms').ComponentValue,
 *   after: Array<import ('@csstools/css-parser-algorithms').ComponentValue>,
 *   operator: import ('@csstools/css-parser-algorithms').ComponentValue | undefined,
 *   operatorToken: import ('@csstools/css-tokenizer').TokenDelim | undefined,
 * }} OperationWithoutOperator
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
 * @returns {operation is OperationWithoutOperator}
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
 * @param {import('@csstools/css-parser-algorithms').ContainerNode} container
 * @param {number} cursor
 * @returns {[Operation | undefined, number]}
 */
function parseOperation(container, cursor) {
	/** @type {Operation} */
	const operation = {
		firstOperand: undefined,
		before: [],
		secondOperand: undefined,
		after: [],
		operator: undefined,
		operatorToken: undefined,
	};

	let currentNode = container.value[cursor];

	while (isWhitespaceNode(currentNode) || isCommentNode(currentNode)) {
		currentNode = container.value[++cursor];
	}

	if (isOperandNode(currentNode)) {
		operation.firstOperand = currentNode;

		currentNode = container.value[++cursor];
	}

	while (isWhitespaceNode(currentNode) || isCommentNode(currentNode)) {
		operation.before.push(currentNode);

		currentNode = container.value[++cursor];
	}

	if (
		isTokenNode(currentNode) &&
		currentNode.value[0] === TokenType.Delim &&
		OPERATORS.has(currentNode.value[4].value)
	) {
		operation.operator = currentNode;
		operation.operatorToken = currentNode.value;

		currentNode = container.value[++cursor];
	}

	while (isWhitespaceNode(currentNode) || isCommentNode(currentNode)) {
		operation.after.push(currentNode);

		currentNode = container.value[++cursor];
	}

	if (isOperandNode(currentNode)) {
		operation.secondOperand = currentNode;

		currentNode = container.value[++cursor];
	}

	while (isWhitespaceNode(currentNode) || isCommentNode(currentNode)) {
		currentNode = container.value[++cursor];
	}

	if (!operation.firstOperand || !operation.secondOperand) {
		while (currentNode) {
			if (
				isTokenNode(currentNode) &&
				(currentNode.value[0] === TokenType.Comma || currentNode.value[0] === TokenType.Semicolon)
			) {
				return [undefined, cursor];
			}

			currentNode = container.value[++cursor];
		}

		return [undefined, container.value.length];
	}

	return [operation, cursor];
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
