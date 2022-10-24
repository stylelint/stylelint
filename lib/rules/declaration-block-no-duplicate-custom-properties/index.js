'use strict';

const eachDeclarationBlock = require('../../utils/eachDeclarationBlock');
const isCustomProperty = require('../../utils/isCustomProperty');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'declaration-block-no-duplicate-custom-properties';

const messages = ruleMessages(ruleName, {
	rejected: (property) => `Unexpected duplicate "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-block-no-duplicate-custom-properties',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		eachDeclarationBlock(root, (eachDecl) => {
			const decls = new Set();

			eachDecl((decl) => {
				const prop = decl.prop;

				if (!isStandardSyntaxProperty(prop)) {
					return;
				}

				if (!isCustomProperty(prop)) {
					return;
				}

				const isDuplicate = decls.has(prop);

				if (isDuplicate) {
					report({
						message: messages.rejected(prop),
						node: decl,
						result,
						ruleName,
						word: prop,
					});

					return;
				}

				decls.add(prop);
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
