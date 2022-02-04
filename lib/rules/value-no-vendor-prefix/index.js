'use strict';

const isAutoprefixable = require('../../utils/isAutoprefixable');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const styleSearch = require('style-search');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isString, assert } = require('../../utils/validateTypes');

const ruleName = 'value-no-vendor-prefix';

const messages = ruleMessages(ruleName, {
	rejected: (value) => `Unexpected vendor-prefix "${value}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/value-no-vendor-prefix',
};

const valuePrefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];

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
			if (
				!isStandardSyntaxDeclaration(decl) ||
				!isStandardSyntaxProperty(decl.prop) ||
				!decl.value.startsWith('-')
			) {
				return;
			}

			const prop = decl.prop;
			const value = decl.value;
			const unprefixedValue = vendor.unprefixed(value);

			//return early if value is to be ignored
			if (optionsMatches(secondaryOptions, 'ignoreValues', unprefixedValue)) {
				return;
			}

			// Search the full declaration in order to get an accurate index

			styleSearch({ source: value.toLowerCase(), target: valuePrefixes }, (match) => {
				const fullIdentifierMatch = /^(-[a-z-]+)\b/i.exec(value.slice(match.startIndex));

				assert(fullIdentifierMatch);
				const fullIdentifier = fullIdentifierMatch[1];

				if (!isAutoprefixable.propertyValue(fullIdentifier)) {
					return;
				}

				if (context.fix) {
					decl.value = isAutoprefixable.unprefix(decl.value);

					return;
				}

				report({
					message: messages.rejected(fullIdentifier),
					node: decl,
					index: prop.length + (decl.raws.between || '').length + match.startIndex,
					result,
					ruleName,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
