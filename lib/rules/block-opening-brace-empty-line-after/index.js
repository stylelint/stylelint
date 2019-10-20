'use strict';

const addEmptyLineBefore = require('../../utils/addEmptyLineBefore');
const blockString = require('../../utils/blockString');
const hasBlock = require('../../utils/hasBlock');
const hasEmptyBlock = require('../../utils/hasEmptyBlock');
const hasEmptyLine = require('../../utils/hasEmptyLine');
const isSingleLineString = require('../../utils/isSingleLineString');
const removeEmptyLinesBefore = require('../../utils/removeEmptyLinesBefore');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'block-opening-brace-empty-line-after';

const messages = ruleMessages(ruleName, {
	expected: 'Expected empty line after opening brace',
	rejected: 'Unexpected empty line after opening brace',
});

const rule = function(expectation, options, context) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: expectation,
			possible: ['always-multi-line', 'never'],
		});

		if (!validOptions) {
			return;
		}

		// Check both kinds of statements: rules and at-rules
		root.walkRules(check);
		root.walkAtRules(check);

		function check(statement) {
			// Return early if blockless or has empty block
			if (!hasBlock(statement) || hasEmptyBlock(statement)) {
				return;
			}

			// Get whitespace after "{"
			const after = statement.nodes[0].raws.before || '';

			// Set expectation
			const expectEmptyLineAfter =
				expectation === 'always-multi-line' && !isSingleLineString(blockString(statement));

			// Check for at least one empty line
			const hasEmptyLineAfter = hasEmptyLine(after);

			// Return if the expectation is met
			if (expectEmptyLineAfter === hasEmptyLineAfter) {
				return;
			}

			// Calculate index
			const statementString = statement.toString();
			const index = statementString.indexOf('{') + 1;

			if (context.fix) {
				if (expectEmptyLineAfter) {
					addEmptyLineBefore(statement.nodes[0], context.newline);
				} else {
					removeEmptyLinesBefore(statement.nodes[0], context.newline);
				}

				return;
			}

			const message = expectEmptyLineAfter ? messages.expected : messages.rejected;

			report({
				message,
				result,
				ruleName,
				node: statement,
				index,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
