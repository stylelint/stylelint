// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const valueParser = require('postcss-value-parser');
const validateTypes = require('../../utils/validateTypes.cjs');
const functions = require('../../reference/functions.cjs');
const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const getDeclarationValue = require('../../utils/getDeclarationValue.cjs');
const isStandardSyntaxFunction = require('../../utils/isStandardSyntaxFunction.cjs');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const setDeclarationValue = require('../../utils/setDeclarationValue.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'function-name-case';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/function-name-case',
	fixable: true,
};

const mapLowercaseFunctionNamesToCamelCase = new Map();

for (const func of functions.camelCaseFunctions) {
	mapLowercaseFunctionNamesToCamelCase.set(func.toLowerCase(), func);
}

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['lower', 'upper'],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignoreFunctions: [validateTypes.isString, validateTypes.isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			if (!decl.value.includes('(')) return;

			if (!isStandardSyntaxValue(decl.value)) return;

			const parsed = valueParser(getDeclarationValue(decl));

			parsed.walk((node) => {
				if (node.type !== 'function' || !isStandardSyntaxFunction(node)) {
					return;
				}

				const functionName = node.value;
				const functionNameLowerCase = functionName.toLowerCase();

				if (optionsMatches(secondaryOptions, 'ignoreFunctions', functionName)) {
					return;
				}

				/** @type {string} */
				let expectedFunctionName;

				if (
					primary === 'lower' &&
					mapLowercaseFunctionNamesToCamelCase.has(functionNameLowerCase)
				) {
					expectedFunctionName = mapLowercaseFunctionNamesToCamelCase.get(functionNameLowerCase);
				} else if (primary === 'lower') {
					expectedFunctionName = functionNameLowerCase;
				} else {
					expectedFunctionName = functionName.toUpperCase();
				}

				if (functionName === expectedFunctionName) {
					return;
				}

				const index = nodeFieldIndices.declarationValueIndex(decl) + node.sourceIndex;
				const endIndex = index + functionName.length;
				const fix = () => {
					node.value = expectedFunctionName;
					setDeclarationValue(decl, parsed.toString());
				};

				report({
					message: messages.expected,
					messageArgs: [functionName, expectedFunctionName],
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
					fix: {
						apply: fix,
						node: decl,
					},
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
