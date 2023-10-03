'use strict';

const fs = require('node:fs');
const cssParserAlgorithms = require('@csstools/css-parser-algorithms');
const functionsListPath = require('css-functions-list');
const cssTokenizer = require('@csstools/css-tokenizer');
const validateTypes = require('../../utils/validateTypes.cjs');
const declarationValueIndex = require('../../utils/declarationValueIndex.cjs');
const isCustomFunction = require('../../utils/isCustomFunction.cjs');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'function-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected unknown function "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/function-no-unknown',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
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

		const functionsList = [
			...JSON.parse(fs.readFileSync(functionsListPath.toString(), 'utf8')),
			// #5960
			'-webkit-gradient',
			'color-stop',
			'from',
			'to',
		];

		root.walkDecls((decl) => {
			const { value } = decl;

			if (!value.includes('(')) return;

			if (!isStandardSyntaxValue(value)) return;

			/**
			 * @param {import('@csstools/css-parser-algorithms').ComponentValue} componentValue
			 */
			const walker = (componentValue) => {
				if (!cssParserAlgorithms.isFunctionNode(componentValue)) return;

				const name = componentValue.getName();

				if (isCustomFunction(name)) return;

				if (optionsMatches(secondaryOptions, 'ignoreFunctions', name)) return;

				if (functionsList.includes(name.toLowerCase())) return;

				report({
					message: messages.rejected,
					messageArgs: [name],
					node: decl,
					index: declarationValueIndex(decl) + componentValue.name[2],
					result,
					ruleName,
					word: name,
				});
			};

			cssParserAlgorithms.parseListOfComponentValues(cssTokenizer.tokenize({ css: value })).forEach((componentValue) => {
				if (cssParserAlgorithms.isFunctionNode(componentValue) || cssParserAlgorithms.isSimpleBlockNode(componentValue)) {
					walker(componentValue);

					componentValue.walk(({ node }) => {
						walker(node);
					});
				}
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
