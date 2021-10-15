'use strict';

const balancedMatch = require('balanced-match');
const isWhitespace = require('../../utils/isWhitespace');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const styleSearch = require('style-search');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'function-calc-no-unspaced-operator';

const messages = ruleMessages(ruleName, {
	expectedBefore: (operator) => `Expected single space before "${operator}" operator`,
	expectedAfter: (operator) => `Expected single space after "${operator}" operator`,
	expectedOperatorBeforeSign: (operator) => `Expected an operator before sign "${operator}"`,
});

/** @typedef {{ index: number, insert: boolean }} SymbolToFix */

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		/**
		 * @param {string} message
		 * @param {import('postcss').Node} node
		 * @param {number} index
		 */
		function complain(message, node, index) {
			report({ message, node, index, result, ruleName });
		}

		root.walkDecls((decl) => {
			/** @type {SymbolToFix[]} */
			const symbolsToFix = [];

			valueParser(decl.value).walk((node) => {
				if (node.type !== 'function' || node.value.toLowerCase() !== 'calc') {
					return;
				}

				const nodeText = valueParser.stringify(node);
				const parensMatch = balancedMatch('(', ')', nodeText);

				if (!parensMatch) {
					throw new Error(`No parens match: "${nodeText}"`);
				}

				if (decl.source == null || decl.source.start == null) {
					throw new Error('Declaration source must be present');
				}

				const rawExpression = parensMatch.body;
				const expressionIndex =
					decl.source.start.column +
					decl.prop.length +
					(decl.raws.between || '').length +
					node.sourceIndex;
				const expression = blurVariables(rawExpression);

				const parensMatchStart = parensMatch.start;

				checkSymbol('+');
				checkSymbol('-');
				checkSymbol('*');
				checkSymbol('/');

				/**
				 * @param {string} symbol
				 */
				function checkSymbol(symbol) {
					/** @type {import('style-search').Options} */
					const styleSearchOptions = {
						source: expression,
						target: symbol,
						functionArguments: 'skip',
					};

					styleSearch(styleSearchOptions, (match) => {
						const index = match.startIndex;
						const symbolIndex = node.sourceIndex + parensMatchStart + index + 1;

						// Deal with signs.
						// (@ and $ are considered "digits" here to allow for variable syntaxes
						// that permit signs in front of variables, e.g. `-$number`)
						// As is "." to deal with fractional numbers without a leading zero
						if ((symbol === '+' || symbol === '-') && /[\d@$.]/.test(expression[index + 1])) {
							const expressionBeforeSign = expression.slice(0, index);

							// Ignore signs that directly follow a opening bracket
							if (expressionBeforeSign[expressionBeforeSign.length - 1] === '(') {
								return;
							}

							// Ignore signs at the beginning of the expression
							if (/^\s*$/.test(expressionBeforeSign)) {
								return;
							}

							// Otherwise, ensure that there is a real operator preceding them
							if (/[*/+-]\s*$/.test(expressionBeforeSign)) {
								return;
							}

							if (!context.fix) {
								// And if not, complain
								complain(
									messages.expectedOperatorBeforeSign(symbol),
									decl,
									expressionIndex + index,
								);

								return;
							}
						}

						const beforeOk =
							(expression[index - 1] === ' ' && !isWhitespace(expression[index - 2])) ||
							newlineBefore(expression, index - 1);

						if (!beforeOk) {
							if (context.fix) {
								let step = 1;

								// Remove all whitespace characters before the operator, e.g. `\t`
								while (isWhitespace(expression[index - step])) {
									symbolsToFix.push({
										index: symbolIndex - step,
										insert: false,
									});

									step++;
								}

								// Add only one space character
								symbolsToFix.push({
									index: symbolIndex,
									insert: true,
								});
							} else {
								complain(messages.expectedBefore(symbol), decl, expressionIndex + index);
							}
						}

						const afterOk =
							(expression[index + 1] === ' ' && !isWhitespace(expression[index + 2])) ||
							isNewlineAtIndex(expression, index + 1);

						if (!afterOk) {
							if (context.fix) {
								let step = 1;
								let spaceNeeded = true;

								// Remove all whitespace characters before the operator or \n, e.g. \t
								while (isWhitespace(expression[index + step])) {
									if (isNewlineAtIndex(expression, index + step)) {
										spaceNeeded = false;
										break;
									}

									symbolsToFix.push({
										index: symbolIndex + step,
										insert: false,
									});
									step++;
								}

								// Insert one space character if there is no \n
								if (spaceNeeded) {
									symbolsToFix.push({
										index: symbolIndex + 1,
										insert: true,
									});
								}
							} else {
								complain(messages.expectedAfter(symbol), decl, expressionIndex + index);
							}
						}
					});
				}
			});

			if (context.fix) {
				decl.value = symbolsToFix.reduce((/** @type {string} */ fixedValue, { insert, index }) => {
					shiftIndexes(symbolsToFix, index, insert);

					return insert
						? insertCharAtIndex(fixedValue, index, ' ')
						: removeCharAtIndex(fixedValue, index);
				}, decl.value);
			}
		});
	};
};

/**
 * @param {string} str
 * @param {number} index
 */
function isNewlineAtIndex(str, index) {
	return str[index] === '\n' || str.slice(index, index + 2) === '\r\n';
}

/**
 * @param {SymbolToFix[]} symbolsToFix
 * @param {number} index
 * @param {boolean} insert
 */
function shiftIndexes(symbolsToFix, index, insert) {
	symbolsToFix.forEach((symbol) => {
		if (symbol.index > index) {
			symbol.index += insert ? 1 : -1;
		}
	});
}

/**
 * @param {string} str
 * @param {number} index
 */
function removeCharAtIndex(str, index) {
	return str.slice(0, index) + str.slice(index + 1, str.length);
}

/**
 * @param {string} str
 * @param {number} index
 * @param {string} char
 */
function insertCharAtIndex(str, index, char) {
	return str.slice(0, index) + char + str.slice(index, str.length);
}

/**
 * @param {string} source
 */
function blurVariables(source) {
	return source.replace(/[$@][^)\s]+|#\{.+?\}/g, '0');
}

/**
 * @param {string} str
 * @param {number} startIndex
 */
function newlineBefore(str, startIndex) {
	let index = startIndex;

	while (index && isWhitespace(str[index])) {
		if (str[index] === '\n') return true;

		index--;
	}

	return false;
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
