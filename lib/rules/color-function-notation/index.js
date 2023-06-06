'use strict';

const valueParser = require('postcss-value-parser');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const isStandardSyntaxColorFunction = require('../../utils/isStandardSyntaxColorFunction');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const setDeclarationValue = require('../../utils/setDeclarationValue');
const { isValueFunction } = require('../../utils/typeGuards');
const validateOptions = require('../../utils/validateOptions');
const optionsMatches = require('../../utils/optionsMatches');

const ruleName = 'color-function-notation';

const messages = ruleMessages(ruleName, {
	expected: (primary) => `Expected ${primary} color-function notation`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/color-function-notation',
	fixable: true,
};

const LEGACY_FUNCTION_NAME = /^(?:rgba|hsla)$/i;
const LEGACY_NOTATION_FUNCTION = /\b(?:rgba?|hsla?)\(/i;
const LEGACY_NOTATION_FUNCTION_NAME = /^(?:rgba?|hsla?)$/i;

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['modern', 'legacy'],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['with-var-inside'],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		const ignoreWithVarInside = optionsMatches(secondaryOptions, 'ignore', 'with-var-inside');

		root.walkDecls((decl) => {
			if (!LEGACY_NOTATION_FUNCTION.test(decl.value)) return;

			if (primary === 'modern' && !decl.value.includes(',')) return;

			let needsFix = false;
			const parsedValue = valueParser(getDeclarationValue(decl));

			parsedValue.walk((node) => {
				if (!isValueFunction(node)) return;

				if (!isStandardSyntaxColorFunction(node)) return;

				const { value, sourceIndex, sourceEndIndex, nodes } = node;

				if (ignoreWithVarInside && containsVariable(nodes)) {
					return;
				}

				if (!LEGACY_NOTATION_FUNCTION_NAME.test(value)) return;

				if (primary === 'modern' && !hasCommas(node)) return;

				if (primary === 'legacy' && hasCommas(node)) return;

				if (context.fix && primary === 'modern') {
					let commaCount = 0;

					// Convert punctuation
					node.nodes = nodes.map((childNode) => {
						if (isComma(childNode)) {
							// Non-alpha commas to space and alpha commas to slashes
							if (commaCount < 2) {
								// @ts-expect-error -- TS2322: Type '"space"' is not assignable to type '"div"'.
								childNode.type = 'space';
								childNode.value = atLeastOneSpace(childNode.after);
								commaCount++;
							} else {
								childNode.value = '/';
								childNode.before = atLeastOneSpace(childNode.before);
								childNode.after = atLeastOneSpace(childNode.after);
							}
						}

						return childNode;
					});

					// Remove trailing 'a' from legacy function name
					if (LEGACY_FUNCTION_NAME.test(value)) {
						node.value = value.slice(0, -1);
					}

					needsFix = true;

					return;
				}

				const index = declarationValueIndex(decl) + sourceIndex;
				const endIndex = index + (sourceEndIndex - sourceIndex);

				report({
					message: messages.expected,
					messageArgs: [primary],
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
				});
			});

			if (needsFix) {
				setDeclarationValue(decl, parsedValue.toString());
			}
		});
	};
};

/**
 * @param {string} whitespace
 */
function atLeastOneSpace(whitespace) {
	return whitespace !== '' ? whitespace : ' ';
}

/**
 * @param {import('postcss-value-parser').Node[]} nodes
 */
function containsVariable(nodes) {
	return nodes.some(({ type, value }) => type === 'function' && value.toLowerCase() === 'var');
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').DivNode}
 */
function isComma(node) {
	return node.type === 'div' && node.value === ',';
}

/**
 * @param {import('postcss-value-parser').FunctionNode} node
 */
function hasCommas(node) {
	return node.nodes && node.nodes.some((childNode) => isComma(childNode));
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
