'use strict';

const declarationColonSpaceChecker = require('../declarationColonSpaceChecker');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'declaration-colon-space-before';

const messages = ruleMessages(ruleName, {
	expectedBefore: () => 'Expected single space before ":"',
	rejectedBefore: () => 'Unexpected whitespace before ":"',
});

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

		declarationColonSpaceChecker({
			root,
			result,
			locationChecker: checker.before,
			checkedRuleName: ruleName,
			fix: context.fix
				? (decl, index) => {
						const colonIndex = index - declarationValueIndex(decl);
						const between = decl.raws.between;

						if (between == null) throw new Error('`between` must be present');

						if (primary === 'always') {
							decl.raws.between =
								between.slice(0, colonIndex).replace(/\s*$/, ' ') + between.slice(colonIndex);

							return true;
						}

						if (primary === 'never') {
							decl.raws.between =
								between.slice(0, colonIndex).replace(/\s*$/, '') + between.slice(colonIndex);

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
module.exports = rule;
