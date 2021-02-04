// @ts-nocheck

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

function rule(on) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: on });

		if (!validOptions) {
			return;
		}

		eachDeclarationBlock(root, (eachDecl) => {
			const decls = [];

			eachDecl((decl) => {
				const prop = decl.prop;

				if (!isStandardSyntaxProperty(prop)) {
					return;
				}

				if (!isCustomProperty(prop)) {
					return;
				}

				const indexDuplicate = decls.indexOf(prop);

				if (indexDuplicate !== -1) {
					report({
						message: messages.rejected(prop),
						node: decl,
						result,
						ruleName,
					});
				}

				decls.push(prop);
			});
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
