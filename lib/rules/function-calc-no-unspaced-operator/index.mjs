import {
	isFunctionNode,
	isSimpleBlockNode,
	isTokenNode,
	isWhitespaceNode,
	parseListOfComponentValues,
	stringify,
	walk,
} from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

import { calcKeywords } from '../../reference/keywords.mjs';
import declarationValueIndex from '../../utils/declarationValueIndex.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import { isNumber } from '../../utils/validateTypes.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setDeclarationValue from '../../utils/setDeclarationValue.mjs';
import { singleArgumentMathFunctions } from '../../reference/functions.mjs';
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
const ALL_OPERATORS = new Set([...OPERATORS, '*', '/']);
// #7618
const alternatives = [...singleArgumentMathFunctions].join('|');
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

			/**
			 * @param {import('@csstools/css-parser-algorithms').TokenNode} operatorNode
			 * @param {import('@csstools/css-parser-algorithms').ContainerNode} parent
			 * @param {number} index
			 * @param {'before' | 'after'} position
			 * @returns {void}
			 */
			function checkWhitespaceAroundOperator(operatorNode, parent, index, position) {
				const isBefore = position === 'before';
				const aroundNode = parent.value[index + (isBefore ? -1 : 1)];

				if (isWhitespaceNode(aroundNode)) {
					const whitespace = getWhitespace(aroundNode);

					if (whitespace === ' ') return;

					const indexOfFirstNewLine = whitespace.search(NEWLINE_REGEX);

					if (indexOfFirstNewLine === 0) return;

					if (context.fix) {
						needsFix = true;

						const [token] = aroundNode.value;

						if (token) {
							token[1] = indexOfFirstNewLine === -1 ? ' ' : whitespace.slice(indexOfFirstNewLine);
						}

						return;
					}
				} else if (
					isTokenNode(aroundNode) &&
					(isOperandNode(aroundNode) || isScssInterpolation(aroundNode, parent))
				) {
					if (context.fix) {
						needsFix = true;

						if (isBefore) {
							aroundNode.value[1] += ' ';
						} else {
							aroundNode.value[1] = ` ${aroundNode.value[1]}`;
						}

						return;
					}
				} else {
					return;
				}

				const delimToken = getDelimToken(operatorNode);

				if (!delimToken) return;

				const { value: operator, startIndex } = delimToken;
				const message = messages[isBefore ? 'expectedBefore' : 'expectedAfter'](operator);

				complain(message, decl, valueIndex + startIndex, operator);
			}

			/**
			 * @param {import('@csstools/css-parser-algorithms').TokenNode} operandNode
			 * @param {import('@csstools/css-parser-algorithms').ContainerNode} parent
			 * @param {number} index
			 * @returns {void}
			 */
			function checkOperands(operandNode, parent, index) {
				const operandToken = operandNode.value;

				if (!isOperandToken(operandToken)) return;

				const [, operand, operandIndex] = operandToken;

				if (!OPERATOR_REGEX.test(operand)) return;

				const beforeOperandNode = parent.value[index - 1];
				const isFirstOperand = !parent.value.slice(0, index).some(isTokenNode);
				const isLastOperand = !parent.value.slice(index + 1).some(isTokenNode);
				const hasOperatorBeforeOperand = parent.value
					.slice(0, index)
					.findLast((node) => isOperatorNode(node, ALL_OPERATORS));

				let fixedOperand = operand;
				let fixedCount = 0;

				// Scan operator characters in an operand token
				for (const matched of operand.matchAll(new RegExp(OPERATOR_REGEX, 'g'))) {
					const operator = matched[0];
					const operatorIndex = matched.index;

					// Ignore a number sign in the first operand, e.g. "calc(-1px)"
					if (operatorIndex === 0 && isFirstOperand) continue;

					// Ignore a suffixed operator in the last operand, e.g. "calc(1px-)"
					if (operatorIndex === operand.length - 1 && isLastOperand) continue;

					const beforeOperator = operand.charAt(operatorIndex - 1);

					if ((beforeOperator && beforeOperator !== ' ') || isOperandNode(beforeOperandNode)) {
						if (context.fix) {
							fixedOperand = insertCharAtIndex(fixedOperand, operatorIndex + fixedCount, ' ');
							fixedCount++;
						} else {
							complain(
								messages.expectedBefore(operator),
								decl,
								valueIndex + operandIndex + operatorIndex,
								operator,
							);
						}
					}

					const afterOperator = operand.charAt(operatorIndex + 1);

					if (afterOperator && afterOperator !== ' ' && !hasOperatorBeforeOperand) {
						if (context.fix) {
							fixedOperand = insertCharAtIndex(fixedOperand, operatorIndex + fixedCount + 1, ' ');
							fixedCount++;
						} else {
							complain(
								messages.expectedAfter(operator),
								decl,
								valueIndex + operandIndex + operatorIndex,
								operator,
							);
						}
					}
				}

				if (fixedCount > 0) {
					needsFix = true;
					operandToken[1] = fixedOperand;
				}
			}

			const nodes = parseListOfComponentValues(tokenize({ css: value }));

			if (nodes.length === 0) return;

			walk(nodes, ({ node: funcNode }) => {
				if (!isFunctionNode(funcNode)) return;

				if (!FUNC_NAMES_REGEX.test(funcNode.getName())) return;

				funcNode.forEach(({ node, parent }, index) => {
					if (!isNumber(index)) return;

					if (!isTokenNode(node)) return;

					if (isOperatorNode(node, OPERATORS)) {
						// Skip when there are no tokens before the operator.
						if (!parent.value.slice(0, index).some(isTokenNode)) return;

						// Skip when there are no tokens after the operator.
						if (!parent.value.slice(index + 1).some(isTokenNode)) return;

						checkWhitespaceAroundOperator(node, parent, index, 'before');
						checkWhitespaceAroundOperator(node, parent, index, 'after');
					} else {
						checkOperands(node, parent, index);
					}
				});
			});

			if (needsFix) {
				setDeclarationValue(decl, stringify([nodes]));
			}
		});
	};
};

/**
 * @param {string} str
 * @param {number} index
 * @param {string} char
 */
function insertCharAtIndex(str, index, char) {
	return str.slice(0, index) + char + str.slice(index, str.length);
}

/**
 * @param {import('@csstools/css-parser-algorithms').TokenNode} node
 * @returns {{value: string, startIndex: number, endIndex: number} | undefined}
 */
function getDelimToken(node) {
	const [type, value, startIndex, endIndex] = node.value;

	if (type !== 'delim-token') return;

	return { value, startIndex, endIndex };
}

/**
 * @param {import('@csstools/css-parser-algorithms').ComponentValue} node
 * @param {Set<string>} operators
 * @returns {boolean}
 */
function isOperatorNode(node, operators) {
	if (!isTokenNode(node)) return false;

	return operators.has(getDelimToken(node)?.value ?? '');
}

/**
 * @param {import('@csstools/css-parser-algorithms').WhitespaceNode} node
 * @returns {string}
 */
function getWhitespace(node) {
	return node.value[0]?.[1] ?? '';
}

/** @see https://drafts.csswg.org/css-values/#typedef-calc-value */
const OPERAND_TOKEN_TYPES = new Set([
	'number-token',
	'dimension-token',
	'percentage-token',
	'ident-token',
]);

/**
 * @param {import('@csstools/css-tokenizer').CSSToken} token
 * @returns {boolean}
 */
function isOperandToken(token) {
	const [type, value] = token;

	if (!OPERAND_TOKEN_TYPES.has(type)) return false;

	if (type === 'ident-token' && !calcKeywords.has(value)) return false;

	return true;
}

/**
 * @param {import('@csstools/css-parser-algorithms').ComponentValue | undefined} node
 * @returns {boolean}
 */
function isOperandNode(node) {
	return isTokenNode(node) && isOperandToken(node.value);
}

/**
 * @deprecated This support for SCSS interpolation will be removed in the future. It remains only for backward compatiblity.
 *
 * @param {import('@csstools/css-parser-algorithms').TokenNode} node
 * @param {import('@csstools/css-parser-algorithms').ContainerNode} parent
 * @returns {boolean}
 */
function isScssInterpolation(node, parent) {
	// E.g. "#{$foo}"
	if (getDelimToken(node)?.value !== '#') return false;

	const afterNode = parent.at(Number(parent.indexOf(node)) + 1);

	return isSimpleBlockNode(afterNode);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
