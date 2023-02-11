'use strict';

const declarationBangSpaceChecker = require('../declarationBangSpaceChecker');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const ruleMessages = require('../../utils/ruleMessages');
const setDeclarationValue = require('../../utils/setDeclarationValue');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'declaration-bang-space-after';

const messages = ruleMessages(ruleName, {
	expectedAfter: () => 'Expected single space after "!"',
	rejectedAfter: () => 'Unexpected whitespace after "!"',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-bang-space-after',
	fixable: true,
	deprecated: true,
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

		declarationBangSpaceChecker({
			root,
			result,
			locationChecker: checker.after,
			checkedRuleName: ruleName,
			fix: context.fix
				? (decl, index) => {
						let bangIndex = index - declarationValueIndex(decl);
						const declValue = getDeclarationValue(decl);
						let target;
						/** @type {(value: string) => void} */
						let setFixed;

						if (bangIndex < declValue.length) {
							target = declValue;
							setFixed = (value) => {
								setDeclarationValue(decl, value);
							};
						} else if (decl.important) {
							target = decl.raws.important || ' !important';
							bangIndex -= declValue.length;
							setFixed = (value) => {
								decl.raws.important = value;
							};
						} else {
							return false; // not standard
						}

						const targetBefore = target.slice(0, bangIndex + 1);
						const targetAfter = target.slice(bangIndex + 1);

						if (primary === 'always') {
							setFixed(targetBefore + targetAfter.replace(/^\s*/, ' '));

							return true;
						}

						if (primary === 'never') {
							setFixed(targetBefore + targetAfter.replace(/^\s*/, ''));

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
