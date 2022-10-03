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

const meta = {
	url: 'https://stylelint.io/user-guide/rules/custom-property-no-missing-var-function',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		/** @type {Set<string>} */
		const knownCustomProperties = new Set();

		root.walkAtRules(/^property$/i, (atRule) => {
			knownCustomProperties.add(atRule.params);
		});

		root.walkDecls(({ prop }) => {
			if (isCustomProperty(prop)) knownCustomProperties.add(prop);
		});

		root.walkDecls((decl) => {
			const { value } = decl;
			const parsedValue = valueParser(value);

			parsedValue.walk((node) => {
				if (isVarFunction(node)) return false;

				if (!isDashedIdent(node)) return;

				if (!knownCustomProperties.has(node.value)) return;

				const index = declarationValueIndex(decl) + node.sourceIndex;
				const endIndex = index + node.value.length;

				report({
					message: messages.rejected(node.value),
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
				});

				return false;
			});
		});
	};
};

/**
 * @param {import('postcss-value-parser').Node} node
 */
function isDashedIdent({ type, value }) {
	return type === 'word' && value.startsWith('--');
}

/**
 * @param {import('postcss-value-parser').Node} node
 */
function isVarFunction({ type, value }) {
	return type === 'function' && value === 'var';
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
