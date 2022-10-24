'use strict';

const ruleMessages = require('../../utils/ruleMessages');
const selectorCombinatorSpaceChecker = require('../selectorCombinatorSpaceChecker');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'selector-combinator-space-after';

const messages = ruleMessages(ruleName, {
	expectedAfter: (combinator) => `Expected single space after "${combinator}"`,
	rejectedAfter: (combinator) => `Unexpected whitespace after "${combinator}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-combinator-space-after',
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
			locationChecker: checker.after,
			locationType: 'after',
			checkedRuleName: ruleName,
			fix: context.fix
				? (combinator) => {
						if (primary === 'always') {
							combinator.spaces.after = ' ';

							return true;
						}

						if (primary === 'never') {
							combinator.spaces.after = '';

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
