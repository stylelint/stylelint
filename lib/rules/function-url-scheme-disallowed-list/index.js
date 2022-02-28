'use strict';

const functionArgumentsSearch = require('../../utils/functionArgumentsSearch');
const getSchemeFromUrl = require('../../utils/getSchemeFromUrl');
const isStandardSyntaxUrl = require('../../utils/isStandardSyntaxUrl');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'function-url-scheme-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (scheme) => `Unexpected URL scheme "${scheme}:"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/function-url-scheme-disallowed-list',
};

/** @type {import('stylelint').Rule<string | RegExp | Array<string | RegExp>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString, isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			functionArgumentsSearch(decl.toString().toLowerCase(), 'url', (args, index) => {
				const unspacedUrlString = args.trim();

				if (!isStandardSyntaxUrl(unspacedUrlString)) {
					return;
				}

				const urlString = unspacedUrlString.replace(/^['"]+|['"]+$/g, '');
				const scheme = getSchemeFromUrl(urlString);

				if (scheme === null) {
					return;
				}

				if (!matchesStringOrRegExp(scheme, primary)) {
					return;
				}

				report({
					message: messages.rejected(scheme),
					node: decl,
					index,
					result,
					ruleName,
				});
			});
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
