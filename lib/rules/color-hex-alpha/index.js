// @ts-nocheck
'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'color-hex-alpha';

const messages = ruleMessages(ruleName, {
	expected: (hex) => `Expected  alpha channel in "${hex}"`,
	unexpected: (unfixed) => `Unexpected  alpha channel in "${unfixed}"`,
});

function rule(primary) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'never'],
		});

		if (!validOptions) return;

		root.walkDecls((decl) => {
			if (!isStandardSyntaxDeclaration(decl)) return;

			const parsedValue = valueParser(decl.value);

			parsedValue.walk((node) => {
				if (node.type === 'word' && node.value && node.value.startsWith('#')) {
					let hexValue = node.value;

					if (!isStandardSyntaxValue(hexValue)) return;

					if (primary === 'always' && (hexValue.length === 5 || hexValue.length === 9)) {
						return;
					}

					if (primary === 'never' && (hexValue.length === 4 || hexValue.length === 7)) {
						return;
					}

					report({
						message:
							primary === 'never' ? messages.unexpected(hexValue) : messages.expected(hexValue),
						node: decl,
						index: declarationValueIndex(decl) + node.sourceIndex,
						result,
						ruleName,
					});
				}
			});
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
