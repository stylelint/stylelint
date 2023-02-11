'use strict';

const beforeBlockString = require('../../utils/beforeBlockString');
const blockString = require('../../utils/blockString');
const hasBlock = require('../../utils/hasBlock');
const hasEmptyBlock = require('../../utils/hasEmptyBlock');
const optionsMatches = require('../../utils/optionsMatches');
const rawNodeString = require('../../utils/rawNodeString');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'block-opening-brace-newline-after';

const messages = ruleMessages(ruleName, {
	expectedAfter: () => 'Expected newline after "{"',
	expectedAfterMultiLine: () => 'Expected newline after "{" of a multi-line block',
	rejectedAfterMultiLine: () => 'Unexpected whitespace after "{" of a multi-line block',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/block-opening-brace-newline-after',
	fixable: true,
	deprecated: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	const checker = whitespaceChecker('newline', primary, messages);

	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['always', 'rules', 'always-multi-line', 'never-multi-line'],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['rules'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		// Check both kinds of statement: rules and at-rules
		if (!optionsMatches(secondaryOptions, 'ignore', 'rules')) {
			root.walkRules(check);
		}

		root.walkAtRules(check);

		/**
		 * @param {import('postcss').Rule | import('postcss').AtRule} statement
		 */
		function check(statement) {
			// Return early if blockless or has an empty block
			if (!hasBlock(statement) || hasEmptyBlock(statement)) {
				return;
			}

			const backupCommentNextBefores = new Map();

			/**
			 * next node with checking newlines after comment
			 *
			 * @param {import('postcss').ChildNode | undefined} startNode
			 * @returns {import('postcss').ChildNode | undefined}
			 */
			function nextNode(startNode) {
				if (!startNode || !startNode.next) return;

				if (startNode.type === 'comment') {
					const reNewLine = /\r?\n/;
					const newLineMatch = reNewLine.test(startNode.raws.before || '');

					const next = startNode.next();

					if (next && newLineMatch && !reNewLine.test(next.raws.before || '')) {
						backupCommentNextBefores.set(next, next.raws.before);
						next.raws.before = startNode.raws.before;
					}

					return nextNode(next);
				}

				return startNode;
			}

			// Allow an end-of-line comment
			const nodeToCheck = nextNode(statement.first);

			if (!nodeToCheck) {
				return;
			}

			checker.afterOneOnly({
				source: rawNodeString(nodeToCheck),
				index: -1,
				lineCheckStr: blockString(statement),
				err: (m) => {
					if (context.fix) {
						const nodeToCheckRaws = nodeToCheck.raws;

						if (typeof nodeToCheckRaws.before !== 'string') return;

						if (primary.startsWith('always')) {
							const index = nodeToCheckRaws.before.search(/\r?\n/);

							nodeToCheckRaws.before =
								index >= 0
									? nodeToCheckRaws.before.slice(index)
									: context.newline + nodeToCheckRaws.before;

							backupCommentNextBefores.delete(nodeToCheck);

							return;
						}

						if (primary === 'never-multi-line') {
							// Restore the `before` of the node next to the comment node.
							for (const [node, before] of backupCommentNextBefores.entries()) {
								node.raws.before = before;
							}

							backupCommentNextBefores.clear();

							// Fix
							const reNewLine = /\r?\n/;
							let fixTarget = statement.first;

							while (fixTarget) {
								const fixTargetRaws = fixTarget.raws;

								if (typeof fixTargetRaws.before !== 'string') continue;

								if (reNewLine.test(fixTargetRaws.before || '')) {
									fixTargetRaws.before = fixTargetRaws.before.replace(/\r?\n/g, '');
								}

								if (fixTarget.type !== 'comment') {
									break;
								}

								fixTarget = fixTarget.next();
							}

							nodeToCheckRaws.before = '';

							return;
						}
					}

					report({
						message: m,
						node: statement,
						index: beforeBlockString(statement, { noRawBefore: true }).length + 1,
						result,
						ruleName,
					});
				},
			});

			// Restore the `before` of the node next to the comment node.
			for (const [node, before] of backupCommentNextBefores.entries()) {
				node.raws.before = before;
			}
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
