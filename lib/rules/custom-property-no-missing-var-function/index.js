// @ts-nocheck

'use strict';

const valueParser = require('postcss-value-parser');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const isCustomProperty = require('../../utils/isCustomProperty');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'custom-property-no-missing-var-function';

const messages = ruleMessages(ruleName, {
	rejected: (customProperty) => `Unexpected missing var function for "${customProperty}"`,
});

function rule(actual) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual,
		});

		if (!validOptions) return;

		const customProperties = new Set();

		root.walkAtRules(/^property$/i, (atRule) => {
			customProperties.add(atRule.params);
		});

		root.walkDecls(({ prop }) => {
			if (isCustomProperty(prop)) customProperties.add(prop);
		});

		root.walkDecls((decl) => {
			const { value } = decl;
			const parsedValue = valueParser(value);

			parsedValue.walk((node) => {
				if (isVarFunction(node)) return false;

				if (!isDashedIdent(node)) return;

				if (!isKnownCustomProperty(node)) return;

				report({
					message: messages.rejected(node.value),
					node: decl,
					index: declarationValueIndex(decl) + node.sourceIndex,
					result,
					ruleName,
				});

				return false;
			});
		});

		function isKnownCustomProperty({ value }) {
			return customProperties.has(value);
		}
	};
}

function isDashedIdent({ type, value }) {
	return type === 'word' && value.startsWith('--');
}

function isVarFunction({ type, value }) {
	return type === 'function' && value === 'var';
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
