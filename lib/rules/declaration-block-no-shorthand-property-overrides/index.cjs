'use strict';

const eachDeclarationBlock = require('../../utils/eachDeclarationBlock.cjs');
const properties = require('../../reference/properties.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const vendor = require('../../utils/vendor.cjs');

const ruleName = 'declaration-block-no-shorthand-property-overrides';

const messages = ruleMessages(ruleName, {
	rejected: (shorthand, original) => `Unexpected shorthand "${shorthand}" after "${original}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-block-no-shorthand-property-overrides',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		eachDeclarationBlock(root, (eachDecl) => {
			/** @type {Map<string, string>} */
			const declarations = new Map();

			eachDecl((decl) => {
				const prop = decl.prop;
				const unprefixedProp = vendor.unprefixed(prop).toLowerCase();
				const prefix = vendor.prefix(prop).toLowerCase();

				const overrideables = /** @type {Map<string, Set<string>>} */ (
					properties.longhandSubPropertiesOfShorthandProperties
				).get(unprefixedProp);

				if (!overrideables) {
					declarations.set(prop.toLowerCase(), prop);

					return;
				}

				for (const longhandProp of overrideables) {
					const declaration = declarations.get(prefix + longhandProp);

					if (!declaration) {
						continue;
					}

					report({
						ruleName,
						result,
						node: decl,
						message: messages.rejected,
						messageArgs: [prop, declaration || ''],
						word: prop,
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