'use strict';

const fs = require('fs');
const valueParser = require('postcss-value-parser');
const functionsListPath = require('css-functions-list');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const isStandardSyntaxFunction = require('../../utils/isStandardSyntaxFunction');
const isCustomFunction = require('../../utils/isCustomFunction');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'function-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected unknown function "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/function-no-unknown',
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

		const functionsList = JSON.parse(fs.readFileSync(functionsListPath.toString(), 'utf8'));

		root.walkDecls((decl) => {
			const { value } = decl;

			valueParser(value).walk((node) => {
				if (node.type !== 'function') {
					return;
				}

				if (!isStandardSyntaxFunction(node)) {
					return;
				}

				if (isCustomFunction(node.value)) {
					return;
				}

				if (optionsMatches(secondaryOptions, 'ignoreFunctions', node.value)) {
					return;
				}

				if (functionsList.includes(node.value.toLowerCase())) {
					return;
				}

				report({
					message: messages.rejected(node.value),
					node: decl,
					index: declarationValueIndex(decl) + node.sourceIndex,
					result,
					ruleName,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
