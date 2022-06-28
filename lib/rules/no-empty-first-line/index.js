'use strict';

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'no-empty-first-line';
const noEmptyFirstLineTest = /^\s*[\r\n]/;

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected empty line',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/no-empty-first-line',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		// @ts-expect-error -- TS2339: Property 'inline' does not exist on type 'Source'. Property 'lang' does not exist on type 'Source'.
		if (!validOptions || root.source.inline || root.source.lang === 'object-literal') {
			return;
		}

		const rootString = context.fix ? root.toString() : (root.source && root.source.input.css) || '';

		if (!rootString.trim()) {
			return;
		}

		if (noEmptyFirstLineTest.test(rootString)) {
			if (context.fix) {
				if (root.first == null) {
					throw new Error('The root node must have the first node.');
				}

				if (root.first.raws.before == null) {
					throw new Error('The first node must have spaces before.');
				}

				root.first.raws.before = root.first.raws.before.trimStart();

				return;
			}

			report({
				message: messages.rejected,
				node: root,
				result,
				ruleName,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
