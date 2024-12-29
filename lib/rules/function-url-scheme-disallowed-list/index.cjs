// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const functionArgumentsSearch = require('../../utils/functionArgumentsSearch.cjs');
const getSchemeFromUrl = require('../../utils/getSchemeFromUrl.cjs');
const isStandardSyntaxUrl = require('../../utils/isStandardSyntaxUrl.cjs');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'function-url-scheme-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (scheme) => `Unexpected URL scheme "${scheme}:"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/function-url-scheme-disallowed-list',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateTypes.isString, validateTypes.isRegExp],
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

				report.default({
					message: messages.rejected,
					messageArgs: [scheme],
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

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
