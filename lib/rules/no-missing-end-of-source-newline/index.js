'use strict';

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'no-missing-end-of-source-newline';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected missing end-of-source newline',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-missing-end-of-source-newline',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		if (root.source == null) {
			throw new Error('The root node must have a source property');
		}

		// @ts-expect-error -- TS2339: Property 'inline' does not exist on type 'Source'.
		if (root.source.inline || root.source.lang === 'object-literal') {
			return;
		}

		const rootString = context.fix ? root.toString() : root.source.input.css;

		if (!rootString.trim() || rootString.endsWith('\n')) {
			return;
		}

		// Fix
		if (context.fix) {
			root.raws.after = context.newline;

			return;
		}

		report({
			message: messages.rejected,
			node: root,
			index: rootString.length - 1,
			result,
			ruleName,
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
