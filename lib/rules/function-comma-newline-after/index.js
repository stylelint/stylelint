'use strict';

const fixer = require('../functionCommaSpaceFix');
const functionCommaSpaceChecker = require('../functionCommaSpaceChecker');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'function-comma-newline-after';

const messages = ruleMessages(ruleName, {
	expectedAfter: () => 'Expected newline after ","',
	expectedAfterMultiLine: () => 'Expected newline after "," in a multi-line function',
	rejectedAfterMultiLine: () => 'Unexpected whitespace after "," in a multi-line function',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/function-comma-newline-after',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	const checker = whitespaceChecker('newline', primary, messages);

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'always-multi-line', 'never-multi-line'],
		});

		if (!validOptions) {
			return;
		}

		functionCommaSpaceChecker({
			root,
			result,
			locationChecker: checker.afterOneOnly,
			checkedRuleName: ruleName,
			fix: context.fix
				? (div, index, nodes) =>
						fixer({
							div,
							index,
							nodes,
							expectation: primary,
							position: 'after',
							symb: context.newline || '',
						})
				: null,
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
