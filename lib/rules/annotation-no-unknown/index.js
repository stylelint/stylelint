'use strict';

const valueParser = require('postcss-value-parser');

const getDeclarationValue = require('../../utils/getDeclarationValue');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'annotation-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (annotation) => `Unexpected unknown annotation "${annotation}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/annotation-no-unknown',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignoreAnnotations: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls(checkStatement);

		/**
		 * @param {import('postcss').Declaration} decl
		 */
		function checkStatement(decl) {
			if (decl.important) return;

			if (!decl.value.includes('!')) return;

			const parsedValue = valueParser(getDeclarationValue(decl));

			parsedValue.walk((node) => {
				if (!isAnnotation(node)) return;

				const value = node.value;
				const tokenValue = value.slice(1);

				if (optionsMatches(secondaryOptions, 'ignoreAnnotations', tokenValue)) {
					return;
				}

				report({
					message: messages.rejected(value),
					node: decl,
					result,
					ruleName,
					word: value,
				});
			});
		}

		/**
		 * @param {valueParser.Node} node
		 */
		function isAnnotation(node) {
			return node.type === 'word' && node.value.startsWith('!');
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
