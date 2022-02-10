'use strict';

const eachDeclarationBlock = require('../../utils/eachDeclarationBlock');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const shorthandData = require('../../reference/shorthandData');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');

const ruleName = 'declaration-block-no-shorthand-property-overrides';

const messages = ruleMessages(ruleName, {
	rejected: (shorthand, original) => `Unexpected shorthand "${shorthand}" after "${original}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/declaration-block-no-shorthand-property-overrides',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		eachDeclarationBlock(root, (eachDecl) => {
			/** @type {Record<string, string>} */
			const declarations = {};

			eachDecl((decl) => {
				const prop = decl.prop;
				const unprefixedProp = vendor.unprefixed(prop);
				const prefix = vendor.prefix(prop).toLowerCase();

				const overrideables = shorthandData[unprefixedProp.toLowerCase()];

				if (!overrideables) {
					declarations[prop.toLowerCase()] = prop;

					return;
				}

				for (const longhandProp of overrideables) {
					if (!Object.prototype.hasOwnProperty.call(declarations, prefix + longhandProp)) {
						continue;
					}

					report({
						ruleName,
						result,
						node: decl,
						message: messages.rejected(prop, declarations[prefix + longhandProp]),
					});
				}
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
