'use strict';

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'no-empty-source';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected empty source',
});

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		const rootString = context.fix ? root.toString() : (root.source && root.source.input.css) || '';

		if (rootString.trim()) {
			return;
		}

		report({
			message: messages.rejected,
			node: root,
			result,
			ruleName,
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
