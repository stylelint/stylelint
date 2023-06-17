'use strict';

const valueParser = require('postcss-value-parser');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const setDeclarationValue = require('../../utils/setDeclarationValue');
const validateOptions = require('../../utils/validateOptions');
const { assert } = require('../../utils/validateTypes');

const ruleName = 'function-calc-no-unspaced-operator';

const messages = ruleMessages(ruleName, {
	expectedBefore: (operator) => `Expected single space before "${operator}" operator`,
	expectedAfter: (operator) => `Expected single space after "${operator}" operator`,
	expectedOperatorBeforeSign: (operator) => `Expected an operator before sign "${operator}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/function-calc-no-unspaced-operator',
	fixable: true,
};

const OPERATORS = new Set(['+', '-']);
const OPERATOR_REGEX = /[+-]/;
const ALL_OPERATORS = new Set([...OPERATORS, '*', '/']);

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

			let needsFix = false;
			const valueIndex = declarationValueIndex(decl);
			const parsedValue = valueParser(value);

			/**
			 * @param {import('postcss-value-parser').Node} operatorNode
			 * @param {import('postcss-value-parser').Node} currentNode
			 * @param {boolean} isBeforeOp
			 */
			function checkAroundOperator(operatorNode, currentNode, isBeforeOp) {
				const operator = operatorNode.value;
				const operatorSourceIndex = operatorNode.sourceIndex;

				if (currentNode && !isSingleSpace(currentNode)) {
					if (currentNode.type === 'word') {
						if (isBeforeOp) {
							const lastChar = currentNode.value.slice(-1);

							if (OPERATORS.has(lastChar)) {
								if (context.fix) {
									currentNode.value = `${currentNode.value.slice(0, -1)} ${lastChar}`;

									return true;
								}

								complain(
									messages.expectedOperatorBeforeSign(operator),
									decl,
									operatorSourceIndex,
									operator,
								);

								return true;
							}
						} else {
							const firstChar = currentNode.value.slice(0, 1);

							if (OPERATORS.has(firstChar)) {
								if (context.fix) {
									currentNode.value = `${firstChar} ${currentNode.value.slice(1)}`;

									return true;
								}

								complain(messages.expectedAfter(operator), decl, operatorSourceIndex, operator);

								return true;
							}
						}

						if (context.fix) {
							needsFix = true;
							currentNode.value = isBeforeOp ? `${currentNode.value} ` : ` ${currentNode.value}`;

							return true;
						}

						complain(
							isBeforeOp ? messages.expectedBefore(operator) : messages.expectedAfter(operator),
							decl,
							valueIndex + operatorSourceIndex,
							operator,
						);

						return true;
					}

					if (currentNode.type === 'space') {
						const indexOfFirstNewLine = currentNode.value.search(/(\n|\r\n)/);

						if (indexOfFirstNewLine === 0) return;

						if (context.fix) {
							needsFix = true;
							currentNode.value =
								indexOfFirstNewLine === -1 ? ' ' : currentNode.value.slice(indexOfFirstNewLine);

							return true;
						}

						const message = isBeforeOp
							? messages.expectedBefore(operator)
							: messages.expectedAfter(operator);

						complain(message, decl, valueIndex + operatorSourceIndex, operator);

						return true;
					}

					if (currentNode.type === 'function') {
						if (context.fix) {
							needsFix = true;
							currentNode.value = isBeforeOp ? `${currentNode.value} ` : ` ${currentNode.value}`;

							return true;
						}

						const message = isBeforeOp
							? messages.expectedBefore(operator)
							: messages.expectedAfter(operator);

						complain(message, decl, valueIndex + operatorSourceIndex, operator);

						return true;
					}
				}

				return false;
			}

			/**
			 * @param {import('postcss-value-parser').Node[]} nodes
			 */
			function checkForOperatorInFirstNode(nodes) {
				const firstNode = nodes[0];

				assert(firstNode);

				if (firstNode.type !== 'word') return false;

				if (!isStandardSyntaxValue(firstNode.value)) return false;

				const operatorIndex = firstNode.value.search(OPERATOR_REGEX);
				const operator = firstNode.value.slice(operatorIndex, operatorIndex + 1);

				if (operatorIndex <= 0) return false;

				const charBefore = firstNode.value.charAt(operatorIndex - 1);
				const charAfter = firstNode.value.charAt(operatorIndex + 1);

				if (charBefore && charBefore !== ' ' && charAfter && charAfter !== ' ') {
					if (context.fix) {
						needsFix = true;
						firstNode.value = insertCharAtIndex(firstNode.value, operatorIndex + 1, ' ');
						firstNode.value = insertCharAtIndex(firstNode.value, operatorIndex, ' ');
					} else {
						complain(
							messages.expectedBefore(operator),
							decl,
							valueIndex + firstNode.sourceIndex + operatorIndex,
							operator,
						);
						complain(
							messages.expectedAfter(operator),
							decl,
							valueIndex + firstNode.sourceIndex + operatorIndex + 1,
							operator,
						);
					}
				} else if (charBefore && charBefore !== ' ') {
					if (context.fix) {
						needsFix = true;
						firstNode.value = insertCharAtIndex(firstNode.value, operatorIndex, ' ');
					} else {
						complain(
							messages.expectedBefore(operator),
							decl,
							valueIndex + firstNode.sourceIndex + operatorIndex,
							operator,
						);
					}
				} else if (charAfter && charAfter !== ' ') {
					if (context.fix) {
						needsFix = true;
						firstNode.value = insertCharAtIndex(firstNode.value, operatorIndex, ' ');
					} else {
						complain(
							messages.expectedAfter(operator),
							decl,
							valueIndex + firstNode.sourceIndex + operatorIndex + 1,
							operator,
						);
					}
				}

				return true;
			}

			/**
			 * @param {import('postcss-value-parser').Node[]} nodes
			 */
			function checkForOperatorInLastNode(nodes) {
				if (nodes.length === 1) return false;

				const lastNode = nodes[nodes.length - 1];

				assert(lastNode);

				if (lastNode.type !== 'word') return false;

				const operatorIndex = lastNode.value.search(OPERATOR_REGEX);

				if (operatorIndex === -1) return false;

				if (lastNode.value.charAt(operatorIndex - 1) === ' ') return false;

				// E.g. "10px * -2" when the last node is "-2"
				if (
					isOperator(nodes[nodes.length - 3], ALL_OPERATORS) &&
					isSingleSpace(nodes[nodes.length - 2])
				) {
					return false;
				}

				if (context.fix) {
					needsFix = true;
					lastNode.value = insertCharAtIndex(lastNode.value, operatorIndex + 1, ' ').trim();
					lastNode.value = insertCharAtIndex(lastNode.value, operatorIndex, ' ').trim();

					return true;
				}

				const operator = lastNode.value.charAt(operatorIndex);

				complain(
					messages.expectedOperatorBeforeSign(operator),
					decl,
					valueIndex + lastNode.sourceIndex + operatorIndex,
					operator,
				);

				return true;
			}

			/**
			 * @param {import('postcss-value-parser').Node[]} nodes
			 */
			function checkWords(nodes) {
				if (checkForOperatorInFirstNode(nodes) || checkForOperatorInLastNode(nodes)) return;

				for (const [index, node] of nodes.entries()) {
					const lastChar = node.value.slice(-1);
					const firstChar = node.value.slice(0, 1);

					if (node.type === 'word') {
						if (index === 0 && OPERATORS.has(lastChar)) {
							if (context.fix) {
								node.value = `${node.value.slice(0, -1)} ${lastChar}`;

								continue;
							}

							complain(messages.expectedBefore(lastChar), decl, node.sourceIndex, lastChar);
						} else if (index === nodes.length && OPERATORS.has(firstChar)) {
							if (context.fix) {
								node.value = `${firstChar} ${node.value.slice(1)}`;

								continue;
							}

							complain(
								messages.expectedOperatorBeforeSign(firstChar),
								decl,
								node.sourceIndex,
								firstChar,
							);
						}
					}
				}
			}

			parsedValue.walk((node) => {
				if (node.type !== 'function' || node.value.toLowerCase() !== 'calc') return;

				const { nodes } = node;

				if (!nodes.length) return;

				let foundOperatorNode = false;

				for (const [nodeIndex, currNode] of nodes.entries()) {
					if (!isOperator(currNode)) continue;

					foundOperatorNode = true;

					const nodeBefore = nodes[nodeIndex - 1];
					const nodeAfter = nodes[nodeIndex + 1];

					if (isSingleSpace(nodeBefore) && isSingleSpace(nodeAfter)) continue;

					if (nodeAfter && checkAroundOperator(currNode, nodeAfter, false)) continue;

					nodeBefore && checkAroundOperator(currNode, nodeBefore, true);
				}

				if (!foundOperatorNode) {
					checkWords(nodes);
				}
			});

			if (needsFix) {
				setDeclarationValue(decl, parsedValue.toString());
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
 * @param {import('postcss-value-parser').Node | undefined} node
 * @returns {node is import('postcss-value-parser').SpaceNode & { value: ' ' } }
 */
function isSingleSpace(node) {
	return node != null && node.type === 'space' && node.value === ' ';
}

/**
 * @param {import('postcss-value-parser').Node | undefined} node
 * @param {Set<string>} [operators]
 * @returns {node is import('postcss-value-parser').WordNode}
 */
function isOperator(node, operators = OPERATORS) {
	return node != null && node.type === 'word' && operators.has(node.value);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
