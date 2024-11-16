import { createRequire } from 'node:module';

import { isFunctionNode, parseListOfComponentValues, walk } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import isCustomFunction from '../../utils/isCustomFunction.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const require = createRequire(import.meta.url);

// TODO: Replace this with Import attributes when dropping the support for older Node.js versions.
// See https://nodejs.org/api/esm.html#import-attributes
const functionsList = require('css-functions-list/index.json');

const ruleName = 'function-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected unknown function "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/function-no-unknown',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
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

		root.walkDecls((decl) => {
			const { value } = decl;

			if (!value.includes('(')) return;

			if (!isStandardSyntaxValue(value)) return;

			walk(parseListOfComponentValues(tokenize({ css: value })), ({ node }) => {
				if (!isFunctionNode(node)) return;

				const name = node.getName();

				if (isCustomFunction(name)) return;

				if (optionsMatches(secondaryOptions, 'ignoreFunctions', name)) return;

				if (functionsList.includes(name.toLowerCase())) return;

				report({
					message: messages.rejected,
					messageArgs: [name],
					node: decl,
					index: declarationValueIndex(decl) + node.name[2],
					result,
					ruleName,
					word: name,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
