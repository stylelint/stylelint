'use strict';

const ruleMessages = require('../../utils/ruleMessages');
const selectorCombinatorSpaceChecker = require('../selectorCombinatorSpaceChecker');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'selector-combinator-space-before';

const messages = ruleMessages(ruleName, {
	expectedBefore: (combinator) => `Expected single space before "${combinator}"`,
	rejectedBefore: (combinator) => `Unexpected whitespace before "${combinator}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-combinator-space-before',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	const checker = whitespaceChecker('space', primary, messages);

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'never'],
		});

		if (!validOptions) {
			return;
		}

		selectorCombinatorSpaceChecker({
			root,
			result,
			locationChecker: checker.before,
			locationType: 'before',
			checkedRuleName: ruleName,
			fix: context.fix
				? (combinator) => {
						if (primary === 'always') {
							combinator.spaces.before = ' ';

							return true;
						}

						if (primary === 'never') {
							combinator.spaces.before = '';

							return true;
						}

						return false;
				  }
				: null,
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
