'use strict';

const beforeBlockString = require('../../utils/beforeBlockString');
const hasBlock = require('../../utils/hasBlock');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const { isConfigurationComment } = require('../../utils/configurationComment');
const { isComment } = require('../../utils/typeGuards');
const validateOptions = require('../../utils/validateOptions');
const { isBoolean } = require('../../utils/validateTypes');

const ruleName = 'block-no-empty';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected empty block',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/block-no-empty',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
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

		/** @typedef {import('postcss').Rule | import('postcss').AtRule} Statement */

		/**
		 * @param {Statement} statement
		 */
		function check(statement) {
			if (!hasBlock(statement)) {
				return;
			}

			if (hasNotableChild(statement)) {
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
				start: statement.positionBy({ index }),
				result,
				ruleName,
			});
		}

		/**
		 * @param {Statement} statement
		 * @returns {boolean}
		 */
		function hasNotableChild(statement) {
			return statement.nodes.some((child) => {
				if (isComment(child)) {
					if (ignoreComments) return false;

					if (isConfigurationComment(child, context.configurationComment)) return false;
				}

				return true;
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
