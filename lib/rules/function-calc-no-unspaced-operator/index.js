'use strict';

const valueParser = require('postcss-value-parser');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const setDeclarationValue = require('../../utils/setDeclarationValue');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'function-calc-no-unspaced-operator';

const messages = ruleMessages(ruleName, {
	expectedBefore: (operator) => `Expected single space before "${operator}" operator`,
	expectedAfter: (operator) => `Expected single space after "${operator}" operator`,
	expectedOperatorBeforeSign: (operator) => `Expected an operator before sign "${operator}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/function-calc-no-unspaced-operator',
};

const OPERATORS = new Set(['*', '/', '+', '-']);
const OPERATOR_REGEX = /[*/+-]/;

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		/**
		 * @param {string} message
		 * @param {import('postcss').Node} node
		 * @param {number} index
		 */
		function complain(message, node, index) {
			report({ message, node, index, result, ruleName });
		}

		root.walkDecls((decl) => {
			let needsFix = false;
			const valueIndex = declarationValueIndex(decl);
			const parsedValue = valueParser(getDeclarationValue(decl));

			/**
			 * @param {import('postcss-value-parser').Node[]} nodes
			 * @param {number} operatorIndex
			 * @param {-1 | 1} direction
			 */
			function checkAroundOperator(nodes, operatorIndex, direction) {
				const isBeforeOp = direction === -1;
				const currentNode = nodes[operatorIndex + direction];
				const operator = nodes[operatorIndex].value;
				const operatorSourceIndex = nodes[operatorIndex].sourceIndex;

				if (currentNode && !isSingleSpace(currentNode)) {
					if (currentNode.type === 'word') {
						if (isBeforeOp) {
							const lastChar = currentNode.value.slice(-1);

							if (OPERATORS.has(lastChar)) {
								if (context.fix) {
									currentNode.value = `${currentNode.value.slice(0, -1)} ${lastChar}`;

									return true;
								}

								complain(messages.expectedOperatorBeforeSign(operator), decl, operatorSourceIndex);

								return true;
							}
						} else {
							const firstChar = currentNode.value.slice(0, 1);

							if (OPERATORS.has(firstChar)) {
								if (context.fix) {
									currentNode.value = `${firstChar} ${currentNode.value.slice(1)}`;

									return true;
								}

								complain(messages.expectedAfter(operator), decl, operatorSourceIndex);

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

						complain(message, decl, valueIndex + operatorSourceIndex);

						return true;
					}

					if (currentNode.type === 'function') {
						if (context.fix) {
							needsFix = true;
							nodes.splice(operatorIndex, 0, {
								type: 'space',
								value: ' ',
								sourceIndex: 0,
								sourceEndIndex: 1,
							});

							return true;
						}

						const message = isBeforeOp
							? messages.expectedBefore(operator)
							: messages.expectedAfter(operator);

						complain(message, decl, valueIndex + operatorSourceIndex);

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

				const operatorIndex =
					(firstNode.type === 'word' || -1) && firstNode.value.search(OPERATOR_REGEX);
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
						);
						complain(
							messages.expectedAfter(operator),
							decl,
							valueIndex + firstNode.sourceIndex + operatorIndex + 1,
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

				const operatorIndex =
					(lastNode.type === 'word' || -1) && lastNode.value.search(OPERATOR_REGEX);

				if (lastNode.value[operatorIndex - 1] === ' ') return false;

				if (context.fix) {
					needsFix = true;
					lastNode.value = insertCharAtIndex(lastNode.value, operatorIndex + 1, ' ').trim();
					lastNode.value = insertCharAtIndex(lastNode.value, operatorIndex, ' ').trim();

					return true;
				}

				complain(
					messages.expectedOperatorBeforeSign(lastNode.value[operatorIndex]),
					decl,
					valueIndex + lastNode.sourceIndex + operatorIndex,
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

							complain(messages.expectedBefore(lastChar), decl, node.sourceIndex);
						} else if (index === nodes.length && OPERATORS.has(firstChar)) {
							if (context.fix) {
								node.value = `${firstChar} ${node.value.slice(1)}`;

								continue;
							}

							complain(messages.expectedOperatorBeforeSign(firstChar), decl, node.sourceIndex);
						}
					}
				}
			}

			parsedValue.walk((node) => {
				if (node.type !== 'function' || node.value.toLowerCase() !== 'calc') return;

				let foundOperatorNode = false;

				for (const [nodeIndex, currNode] of node.nodes.entries()) {
					if (currNode.type !== 'word' || !OPERATORS.has(currNode.value)) continue;

					foundOperatorNode = true;

					const nodeBefore = node.nodes[nodeIndex - 1];
					const nodeAfter = node.nodes[nodeIndex + 1];

					if (isSingleSpace(nodeBefore) && isSingleSpace(nodeAfter)) continue;

					if (checkAroundOperator(node.nodes, nodeIndex, 1)) continue;

					checkAroundOperator(node.nodes, nodeIndex, -1);
				}

				if (!foundOperatorNode) {
					checkWords(node.nodes);
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
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').SpaceNode & { value: ' ' } }
 */
function isSingleSpace(node) {
	return node && node.type === 'space' && node.value === ' ';
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
