'use strict';

const beforeBlockString = require('../../utils/beforeBlockString');
const hasBlock = require('../../utils/hasBlock');
const hasEmptyBlock = require('../../utils/hasEmptyBlock');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isBoolean } = require('../../utils/validateTypes');

const ruleName = 'block-no-empty';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected empty block',
});

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: isBoolean,
			},
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['comments'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const ignoreComments = optionsMatches(secondaryOptions, 'ignore', 'comments');

		// Check both kinds of statements: rules and at-rules
		root.walkRules(check);
		root.walkAtRules(check);

		/**
		 * @param {import('postcss').Rule | import('postcss').AtRule} statement
		 */
		function check(statement) {
			if (!hasEmptyBlock(statement) && !ignoreComments) {
				return;
			}

			if (!hasBlock(statement)) {
				return;
			}

			const hasCommentsOnly = statement.nodes.every((node) => node.type === 'comment');

			if (!hasCommentsOnly) {
				return;
			}

			let index = beforeBlockString(statement, { noRawBefore: true }).length;

			// For empty blocks when using SugarSS parser
			if (statement.raws.between === undefined) {
				index--;
			}

			report({
				message: messages.rejected,
				node: statement,
				index,
				result,
				ruleName,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
