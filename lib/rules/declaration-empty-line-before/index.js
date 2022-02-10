'use strict';

const addEmptyLineBefore = require('../../utils/addEmptyLineBefore');
const blockString = require('../../utils/blockString');
const hasEmptyLine = require('../../utils/hasEmptyLine');
const isAfterComment = require('../../utils/isAfterComment');
const isAfterStandardPropertyDeclaration = require('../../utils/isAfterStandardPropertyDeclaration');
const isCustomProperty = require('../../utils/isCustomProperty');
const isFirstNested = require('../../utils/isFirstNested');
const isFirstNodeOfRoot = require('../../utils/isFirstNodeOfRoot');
const isSingleLineString = require('../../utils/isSingleLineString');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration');
const optionsMatches = require('../../utils/optionsMatches');
const removeEmptyLinesBefore = require('../../utils/removeEmptyLinesBefore');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isAtRule, isRule, isRoot } = require('../../utils/typeGuards');

const ruleName = 'declaration-empty-line-before';

const messages = ruleMessages(ruleName, {
	expected: 'Expected empty line before declaration',
	rejected: 'Unexpected empty line before declaration',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/declaration-empty-line-before',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['always', 'never'],
			},
			{
				actual: secondaryOptions,
				possible: {
					except: ['first-nested', 'after-comment', 'after-declaration'],
					ignore: [
						'after-comment',
						'after-declaration',
						'first-nested',
						'inside-single-line-block',
					],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const prop = decl.prop;
			const parent = decl.parent;

			if (parent == null) {
				return;
			}

			// Ignore the first node
			if (isFirstNodeOfRoot(decl)) {
				return;
			}

			if (!isAtRule(parent) && !isRule(parent) && !isRoot(parent)) {
				return;
			}

			if (!isStandardSyntaxDeclaration(decl)) {
				return;
			}

			if (isCustomProperty(prop)) {
				return;
			}

			// Optionally ignore the node if a comment precedes it
			if (optionsMatches(secondaryOptions, 'ignore', 'after-comment') && isAfterComment(decl)) {
				return;
			}

			// Optionally ignore the node if a declaration precedes it
			if (
				optionsMatches(secondaryOptions, 'ignore', 'after-declaration') &&
				isAfterStandardPropertyDeclaration(decl)
			) {
				return;
			}

			// Optionally ignore the node if it is the first nested
			if (optionsMatches(secondaryOptions, 'ignore', 'first-nested') && isFirstNested(decl)) {
				return;
			}

			// Optionally ignore nodes inside single-line blocks
			if (
				optionsMatches(secondaryOptions, 'ignore', 'inside-single-line-block') &&
				isSingleLineString(blockString(parent))
			) {
				return;
			}

			let expectEmptyLineBefore = primary === 'always';

			// Optionally reverse the expectation if any exceptions apply
			if (
				(optionsMatches(secondaryOptions, 'except', 'first-nested') && isFirstNested(decl)) ||
				(optionsMatches(secondaryOptions, 'except', 'after-comment') && isAfterComment(decl)) ||
				(optionsMatches(secondaryOptions, 'except', 'after-declaration') &&
					isAfterStandardPropertyDeclaration(decl))
			) {
				expectEmptyLineBefore = !expectEmptyLineBefore;
			}

			// Check for at least one empty line
			const hasEmptyLineBefore = hasEmptyLine(decl.raws.before);

			// Return if the expectation is met
			if (expectEmptyLineBefore === hasEmptyLineBefore) {
				return;
			}

			// Fix
			if (context.fix) {
				if (context.newline == null) return;

				if (expectEmptyLineBefore) {
					addEmptyLineBefore(decl, context.newline);
				} else {
					removeEmptyLinesBefore(decl, context.newline);
				}

				return;
			}

			const message = expectEmptyLineBefore ? messages.expected : messages.rejected;

			report({ message, node: decl, result, ruleName });
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
