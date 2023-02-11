'use strict';

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'unicode-bom';

const messages = ruleMessages(ruleName, {
	expected: 'Expected Unicode BOM',
	rejected: 'Unexpected Unicode BOM',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/unicode-bom',
	deprecated: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'never'],
		});

		if (
			!validOptions ||
			!root.source ||
			// @ts-expect-error -- TS2339: Property 'inline' does not exist on type 'Source'.
			root.source.inline ||
			// @ts-expect-error -- TS2339: Property 'lang' does not exist on type 'Source'.
			root.source.lang === 'object-literal' ||
			// Ignore HTML documents
			// @ts-expect-error -- TS2339: Property 'document' does not exist on type 'Root'.
			root.document !== undefined
		) {
			return;
		}

		const { hasBOM } = root.source.input;

		if (primary === 'always' && !hasBOM) {
			report({
				result,
				ruleName,
				message: messages.expected,
				node: root,
				line: 1,
			});
		}

		if (primary === 'never' && hasBOM) {
			report({
				result,
				ruleName,
				message: messages.rejected,
				node: root,
				line: 1,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
