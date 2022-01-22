'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const isSingleLineString = require('../../utils/isSingleLineString');
const isStandardSyntaxFunction = require('../../utils/isStandardSyntaxFunction');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const setDeclarationValue = require('../../utils/setDeclarationValue');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'function-parentheses-space-inside';

const messages = ruleMessages(ruleName, {
	expectedOpening: 'Expected single space after "("',
	rejectedOpening: 'Unexpected whitespace after "("',
	expectedClosing: 'Expected single space before ")"',
	rejectedClosing: 'Unexpected whitespace before ")"',
	expectedOpeningSingleLine: 'Expected single space after "(" in a single-line function',
	rejectedOpeningSingleLine: 'Unexpected whitespace after "(" in a single-line function',
	expectedClosingSingleLine: 'Expected single space before ")" in a single-line function',
	rejectedClosingSingleLine: 'Unexpected whitespace before ")" in a single-line function',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/function-parentheses-space-inside',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'never', 'always-single-line', 'never-single-line'],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			if (!decl.value.includes('(')) {
				return;
			}

			let hasFixed = false;
			const declValue = getDeclarationValue(decl);
			const parsedValue = valueParser(declValue);

			parsedValue.walk((valueNode) => {
				if (valueNode.type !== 'function') {
					return;
				}

				if (!isStandardSyntaxFunction(valueNode)) {
					return;
				}

				// Ignore function without parameters
				if (!valueNode.nodes.length) {
					return;
				}

				const functionString = valueParser.stringify(valueNode);
				const isSingleLine = isSingleLineString(functionString);

				// Check opening ...

				const openingIndex = valueNode.sourceIndex + valueNode.value.length + 1;

				if (primary === 'always' && valueNode.before !== ' ') {
					if (context.fix) {
						hasFixed = true;
						valueNode.before = ' ';
					} else {
						complain(messages.expectedOpening, openingIndex);
					}
				}

				if (primary === 'never' && valueNode.before !== '') {
					if (context.fix) {
						hasFixed = true;
						valueNode.before = '';
					} else {
						complain(messages.rejectedOpening, openingIndex);
					}
				}

				if (isSingleLine && primary === 'always-single-line' && valueNode.before !== ' ') {
					if (context.fix) {
						hasFixed = true;
						valueNode.before = ' ';
					} else {
						complain(messages.expectedOpeningSingleLine, openingIndex);
					}
				}

				if (isSingleLine && primary === 'never-single-line' && valueNode.before !== '') {
					if (context.fix) {
						hasFixed = true;
						valueNode.before = '';
					} else {
						complain(messages.rejectedOpeningSingleLine, openingIndex);
					}
				}

				// Check closing ...

				const closingIndex = valueNode.sourceIndex + functionString.length - 2;

				if (primary === 'always' && valueNode.after !== ' ') {
					if (context.fix) {
						hasFixed = true;
						valueNode.after = ' ';
					} else {
						complain(messages.expectedClosing, closingIndex);
					}
				}

				if (primary === 'never' && valueNode.after !== '') {
					if (context.fix) {
						hasFixed = true;
						valueNode.after = '';
					} else {
						complain(messages.rejectedClosing, closingIndex);
					}
				}

				if (isSingleLine && primary === 'always-single-line' && valueNode.after !== ' ') {
					if (context.fix) {
						hasFixed = true;
						valueNode.after = ' ';
					} else {
						complain(messages.expectedClosingSingleLine, closingIndex);
					}
				}

				if (isSingleLine && primary === 'never-single-line' && valueNode.after !== '') {
					if (context.fix) {
						hasFixed = true;
						valueNode.after = '';
					} else {
						complain(messages.rejectedClosingSingleLine, closingIndex);
					}
				}
			});

			if (hasFixed) {
				setDeclarationValue(decl, parsedValue.toString());
			}

			/**
			 * @param {string} message
			 * @param {number} offset
			 */
			function complain(message, offset) {
				report({
					ruleName,
					result,
					message,
					node: decl,
					index: declarationValueIndex(decl) + offset,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
