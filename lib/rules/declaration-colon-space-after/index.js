'use strict';

const declarationColonSpaceChecker = require('../declarationColonSpaceChecker');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'declaration-colon-space-after';

const messages = ruleMessages(ruleName, {
	expectedAfter: () => 'Expected single space after ":"',
	rejectedAfter: () => 'Unexpected whitespace after ":"',
	expectedAfterSingleLine: () => 'Expected single space after ":" with a single-line declaration',
});

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	const checker = whitespaceChecker('space', primary, messages);

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'never', 'always-single-line'],
		});

		if (!validOptions) {
			return;
		}

		declarationColonSpaceChecker({
			root,
			result,
			locationChecker: checker.after,
			checkedRuleName: ruleName,
			fix: context.fix
				? (decl, index) => {
						const colonIndex = index - declarationValueIndex(decl);
						const between = decl.raws.between;

						if (between == null) throw new Error('`between` must be present');

						if (primary.startsWith('always')) {
							decl.raws.between =
								between.slice(0, colonIndex) + between.slice(colonIndex).replace(/^:\s*/, ': ');

							return true;
						}

						if (primary === 'never') {
							decl.raws.between =
								between.slice(0, colonIndex) + between.slice(colonIndex).replace(/^:\s*/, ':');

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
