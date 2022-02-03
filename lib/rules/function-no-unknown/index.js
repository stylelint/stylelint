'use strict';

const fs = require('fs');
const { URL } = require('url');
const valueParser = require('postcss-value-parser');
const functionsListPath = require('css-functions-list');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const isStandardSyntaxFunction = require('../../utils/isStandardSyntaxFunction');

const ruleName = 'function-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected unknown function "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/function-no-unknown',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		const path = new URL(functionsListPath.toString(), 'file://');
		const functionsList = JSON.parse(fs.readFileSync(path, 'utf8'));

		root.walkDecls((decl) => {
			const { value } = decl;

			valueParser(value).walk((node) => {
				if (node.type !== 'function') {
					return;
				}

				// custom function: https://github.com/w3c/css-houdini-drafts/issues/1007
				if (node.value.startsWith('--')) {
					return;
				}

				if (!isStandardSyntaxFunction(node)) {
					return;
				}

				if (functionsList.includes(node.value)) {
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
