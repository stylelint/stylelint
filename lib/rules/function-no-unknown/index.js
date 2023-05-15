'use strict';

const fs = require('fs');
const functionsListPath = require('css-functions-list');
const { tokenize } = require('@csstools/css-tokenizer');
const {
	parseCommaSeparatedListOfComponentValues,
	isFunctionNode,
	isSimpleBlockNode,
} = require('@csstools/css-parser-algorithms');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const isCustomFunction = require('../../utils/isCustomFunction');
const { isRegExp, isString } = require('../../utils/validateTypes');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');

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
					ignoreFunctions: [isString, isRegExp],
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
			// #6537
			'scroll',
		];

		root.walkDecls((decl) => {
			const { value } = decl;

			if (!isStandardSyntaxValue(value)) return;

			/**
			 * @param {import('@csstools/css-parser-algorithms').ComponentValue} componentValue
			 */
			const walker = (componentValue) => {
				if (!isFunctionNode(componentValue)) return;

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

			parseCommaSeparatedListOfComponentValues(tokenize({ css: value }))
				.flatMap((x) => x)
				.forEach((componentValue) => {
					if (isFunctionNode(componentValue) || isSimpleBlockNode(componentValue)) {
						walker(componentValue);

						componentValue.walk((entry) => {
							walker(entry.node);
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
