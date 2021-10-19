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

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
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
			const expressionIndex = declarationValueIndex(decl);
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

							if (isOperarorChar(lastChar)) {
								if (context.fix) {
									currentNode.value = `${currentNode.value.slice(0, -1)} ${lastChar}`;

									return true;
								}

								complain(messages.expectedOperatorBeforeSign(operator), decl, operatorSourceIndex);

								return true;
							}
						} else {
							const firstChar = currentNode.value.slice(0, 1);

							if (isOperarorChar(firstChar)) {
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
							expressionIndex + operatorSourceIndex,
						);

						return true;
					}

					if (currentNode.type === 'space') {
						if (startsWithNewLine(currentNode) || startsWithCRLF(currentNode)) return;

						if (context.fix) {
							needsFix = true;

							const indexOfFirstNewLine = currentNode.value.search(/(\n|\r\n)/);

							currentNode.value =
								indexOfFirstNewLine === -1 ? ' ' : currentNode.value.slice(indexOfFirstNewLine);

							return true;
						}

						const message = isBeforeOp
							? messages.expectedBefore(operator)
							: messages.expectedAfter(operator);

						complain(message, decl, expressionIndex + operatorSourceIndex);

						return true;
					}

					if (currentNode.type === 'function') {
						if (context.fix) {
							needsFix = true;
							nodes.splice(operatorIndex, 0, { type: 'space', value: ' ', sourceIndex: 0 });

							return true;
						}

						const message = isBeforeOp
							? messages.expectedBefore(operator)
							: messages.expectedAfter(operator);

						complain(message, decl, expressionIndex + operatorSourceIndex);

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
					(firstNode.type === 'word' || -1) && firstNode.value.search(/[+\-*/]/);
				const operator = firstNode.value.slice(operatorIndex, operatorIndex + 1);

				if (operatorIndex <= 0) return false;

				const charBefore = firstNode.value.charAt(operatorIndex - 1);
				const charAfter = firstNode.value.charAt(operatorIndex + 1);

				if (charBefore && charBefore !== ' ' && charAfter && charAfter !== ' ') {
					if (context.fix) {
						needsFix = true;
						firstNode.value = firstNode.value.replace(/[+\-*/]/, ' $& ');
					} else {
						complain(
							messages.expectedBefore(operator),
							decl,
							expressionIndex + firstNode.sourceIndex + operatorIndex,
						);
						complain(
							messages.expectedAfter(operator),
							decl,
							expressionIndex + firstNode.sourceIndex + operatorIndex + 1,
						);
					}
				} else if (charBefore && charBefore !== ' ') {
					if (context.fix) {
						needsFix = true;
						firstNode.value = firstNode.value.replace(/[+\-*/]/, ' $&');
					} else {
						complain(
							messages.expectedBefore(operator),
							decl,
							expressionIndex + firstNode.sourceIndex + operatorIndex,
						);
					}
				} else if (charAfter && charAfter !== ' ') {
					if (context.fix) {
						needsFix = true;
						firstNode.value = firstNode.value.replace(/[+\-*/]/, '$& ');
					} else {
						complain(
							messages.expectedAfter(operator),
							decl,
							expressionIndex + firstNode.sourceIndex + operatorIndex + 1,
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

				const operatorIndex = (lastNode.type === 'word' || -1) && lastNode.value.search(/[*/\-+]/);

				if (lastNode.value[operatorIndex - 1] === ' ') return false;

				if (context.fix) {
					needsFix = true;
					lastNode.value = lastNode.value.replace(/[*/\-+]/, ' $& ').trim();

					return true;
				}

				complain(
					messages.expectedOperatorBeforeSign(lastNode.value[operatorIndex]),
					decl,
					expressionIndex + lastNode.sourceIndex + operatorIndex,
				);

				return true;
			}

			/**
			 * @param {import('postcss-value-parser').Node[]} nodes
			 */
			function checkWords(nodes) {
				if (checkForOperatorInFirstNode(nodes)) return;

				if (checkForOperatorInLastNode(nodes)) return;

				nodes.forEach((node, index) => {
					const lastChar = node.value.slice(-1);
					const firstChar = node.value.slice(0, 1);

					if (isWord(node)) {
						if (index === 0 && ['*', '/', '+', '-'].includes(lastChar)) {
							if (context.fix) {
								node.value = `${node.value.slice(0, -1)} ${lastChar}`;

								return;
							}

							complain(messages.expectedBefore(lastChar), decl, node.sourceIndex);
						} else if (index === nodes.length && ['*', '/', '+', '-'].includes(firstChar)) {
							if (context.fix) {
								node.value = `${firstChar} ${node.value.slice(1)}`;

								return;
							}

							complain(messages.expectedOperatorBeforeSign(firstChar), decl, node.sourceIndex);
						}
					}
				});
			}

			parsedValue.walk((node) => {
				if (!isCalcFunction(node)) return;

				node.nodes = fixLessVariablesWithSymbols(node.nodes);

				/** @type {number[]} */
				const operatorNodes = [];

				node.nodes.forEach((opNode, index) => isOperator(opNode) && operatorNodes.push(index));

				operatorNodes.forEach((operatorNodeIndex) => {
					const nodeBefore = node.nodes[operatorNodeIndex - 1];
					const nodeAfter = node.nodes[operatorNodeIndex + 1];

					if (isSingleSpace(nodeBefore) && isSingleSpace(nodeAfter)) return;

					if (checkAroundOperator(node.nodes, operatorNodeIndex, 1)) return;

					checkAroundOperator(node.nodes, operatorNodeIndex, -1);
				});

				if (operatorNodes.length === 0) {
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
 *
 * @param {import('postcss-value-parser').Node[]} nodes
 */
function fixLessVariablesWithSymbols(nodes) {
	/** @type {import('postcss-value-parser').Node[]} */
	const fixedNodes = [];
	let foundLessVariable = false;

	nodes.forEach((node) => {
		if (isLessVariable(node)) {
			foundLessVariable = true;
			fixedNodes.push(node);
		} else if (foundLessVariable) {
			if (node.type === 'space') {
				foundLessVariable = false;
				fixedNodes.push(node);
			} else {
				fixedNodes[fixedNodes.length - 1].value += node.value;
			}
		} else {
			fixedNodes.push(node);
		}
	});

	return fixedNodes;
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').Node}
 */
function isWord(node) {
	return node && node.type === 'word';
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').WordNode & { value: '*' | '/' | '+' | '-' }}
 */
function isOperator(node) {
	return node && node.type === 'word' && isOperarorChar(node.value);
}

/**
 * @param {string} char
 * @returns {char is '*' | '/' | '+' | '-'}
 */
function isOperarorChar(char) {
	return ['*', '/', '+', '-'].includes(char);
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').SpaceNode}
 */
function isSpace(node) {
	return node && node.type === 'space';
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {boolean} `true` if node starts with new line
 */
function isSingleSpace(node) {
	return isSpace(node) && node.value === ' ';
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {boolean} `true` if node starts with CRLF
 */
function startsWithCRLF(node) {
	return isSpace(node) && node.value.startsWith('\r\n');
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {boolean} `true` if node starts with New Line
 */
function startsWithNewLine(node) {
	return isSpace(node) && node.value.startsWith('\n');
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').FunctionNode}
 */
function isCalcFunction(node) {
	return node && node.type === 'function' && node.value.toLowerCase() === 'calc';
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {boolean} `true` if node looks like a less variable
 */
function isLessVariable(node) {
	return node && node.type === 'word' && node.value.startsWith('@');
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
