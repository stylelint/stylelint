'use strict';

const blockString = require('../../utils/blockString');
const rawNodeString = require('../../utils/rawNodeString');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');
const { isAtRule, isRule } = require('../../utils/typeGuards');

const ruleName = 'declaration-block-semicolon-space-after';

const messages = ruleMessages(ruleName, {
	expectedAfter: () => 'Expected single space after ";"',
	rejectedAfter: () => 'Unexpected whitespace after ";"',
	expectedAfterSingleLine: () =>
		'Expected single space after ";" in a single-line declaration block',
	rejectedAfterSingleLine: () =>
		'Unexpected whitespace after ";" in a single-line declaration block',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/declaration-block-semicolon-space-after',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	const checker = whitespaceChecker('space', primary, messages);

	return function (root, result) {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'never', 'always-single-line', 'never-single-line'],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			// Ignore last declaration if there's no trailing semicolon
			const parentRule = decl.parent;

			if (!parentRule) throw new Error('A parent node must be present');

			if (!isAtRule(parentRule) && !isRule(parentRule)) {
				return;
			}

			if (!parentRule.raws.semicolon && parentRule.last === decl) {
				return;
			}

			const nextDecl = decl.next();

			if (!nextDecl) {
				return;
			}

			checker.after({
				source: rawNodeString(nextDecl),
				index: -1,
				lineCheckStr: blockString(parentRule),
				err: (m) => {
					if (context.fix) {
						if (primary.startsWith('always')) {
							nextDecl.raws.before = ' ';

							return;
						}

						if (primary.startsWith('never')) {
							nextDecl.raws.before = '';

							return;
						}
					}

					report({
						message: m,
						node: decl,
						index: decl.toString().length + 1,
						result,
						ruleName,
					});
				},
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
