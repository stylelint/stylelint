'use strict';

const valueParser = require('postcss-value-parser');

const hasPrefix = require('../../utils/hasPrefix');
const isAutoprefixable = require('../../utils/isAutoprefixable');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const setDeclarationValue = require('../../utils/setDeclarationValue');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isString } = require('../../utils/validateTypes');

const ruleName = 'value-no-vendor-prefix';

const messages = ruleMessages(ruleName, {
	rejected: (value) => `Unexpected vendor-prefix "${value}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/value-no-vendor-prefix',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				optional: true,
				actual: secondaryOptions,
				possible: {
					ignoreValues: [isString],
				},
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const { value } = decl;

			if (!hasPrefix(value)) return;

			if (!isStandardSyntaxDeclaration(decl) || !isStandardSyntaxProperty(decl.prop)) {
				return;
			}

			if (optionsMatches(secondaryOptions, 'ignoreValues', vendor.unprefixed(value))) {
				return;
			}

			const parsedValue = valueParser(value);

			parsedValue.walk((node) => {
				if (!isAutoprefixable.propertyValue(node.value)) {
					return;
				}

				if (context.fix) {
					node.value = isAutoprefixable.unprefix(node.value);

					return;
				}

				const startIndex = decl.prop.length + (decl.raws.between || '').length + node.sourceIndex;

				report({
					message: messages.rejected,
					messageArgs: [node.value],
					node: decl,
					index: startIndex,
					endIndex: startIndex + node.value.length,
					result,
					ruleName,
				});
			});

			setDeclarationValue(decl, parsedValue.toString());
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
