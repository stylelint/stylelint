'use strict';

const functionArgumentsSearch = require('../../utils/functionArgumentsSearch.cjs');
const isStandardSyntaxUrl = require('../../utils/isStandardSyntaxUrl.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'function-url-no-scheme-relative';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected scheme-relative url',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/function-url-no-scheme-relative',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			functionArgumentsSearch(decl.toString().toLowerCase(), 'url', (args, index) => {
				const url = args.trim().replace(/^['"]+|['"]+$/g, '');

				if (!isStandardSyntaxUrl(url) || !url.startsWith('//')) {
					return;
				}

				report({
					message: messages.rejected,
					node: decl,
					index,
					endIndex: index + args.length,
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