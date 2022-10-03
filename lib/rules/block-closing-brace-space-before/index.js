'use strict';

const blockString = require('../../utils/blockString');
const hasBlock = require('../../utils/hasBlock');
const hasEmptyBlock = require('../../utils/hasEmptyBlock');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'block-closing-brace-space-before';

const messages = ruleMessages(ruleName, {
	expectedBefore: () => 'Expected single space before "}"',
	rejectedBefore: () => 'Unexpected whitespace before "}"',
	expectedBeforeSingleLine: () => 'Expected single space before "}" of a single-line block',
	rejectedBeforeSingleLine: () => 'Unexpected whitespace before "}" of a single-line block',
	expectedBeforeMultiLine: () => 'Expected single space before "}" of a multi-line block',
	rejectedBeforeMultiLine: () => 'Unexpected whitespace before "}" of a multi-line block',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/block-closing-brace-space-before',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	const checker = whitespaceChecker('space', primary, messages);

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [
				'always',
				'never',
				'always-single-line',
				'never-single-line',
				'always-multi-line',
				'never-multi-line',
			],
		});

		if (!validOptions) {
			return;
		}

		// Check both kinds of statement: rules and at-rules
		root.walkRules(check);
		root.walkAtRules(check);

		/**
		 * @param {import('postcss').Rule | import('postcss').AtRule} statement
		 */
		function check(statement) {
			// Return early if blockless or has empty block
			if (!hasBlock(statement) || hasEmptyBlock(statement)) {
				return;
			}

			const source = blockString(statement);
			const statementString = statement.toString();

			let index = statementString.length - 2;

			if (statementString[index - 1] === '\r') {
				index -= 1;
			}

			checker.before({
				source,
				index: source.length - 1,
				err: (msg) => {
					if (context.fix) {
						const statementRaws = statement.raws;

						if (typeof statementRaws.after !== 'string') return;

						if (primary.startsWith('always')) {
							statementRaws.after = statementRaws.after.replace(/\s*$/, ' ');

							return;
						}

						if (primary.startsWith('never')) {
							statementRaws.after = statementRaws.after.replace(/\s*$/, '');

							return;
						}
					}

					report({
						message: msg,
						node: statement,
						index,
						result,
						ruleName,
					});
				},
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
