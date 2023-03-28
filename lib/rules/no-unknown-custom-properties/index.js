'use strict';

const valueParser = require('postcss-value-parser');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const { isValueFunction } = require('../../utils/typeGuards');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'no-unknown-custom-properties';

const messages = ruleMessages(ruleName, {
	rejected: (propName) => `Unexpected unknown custom property "${propName}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-unknown-custom-properties',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		/** @type {Set<string>} */
		const declaredCustomProps = new Set();

		root.walkAtRules(/^property$/i, ({ params }) => {
			declaredCustomProps.add(params);
		});

		root.walkDecls(/^--/, ({ prop }) => {
			declaredCustomProps.add(prop);
		});

		root.walkDecls((decl) => {
			const { value } = decl;

			const parsedValue = valueParser(value);

			parsedValue.walk((node) => {
				if (!isValueFunction(node) || node.value !== 'var') return;

				const [firstNode, secondNode] = node.nodes;

				if (!firstNode || declaredCustomProps.has(firstNode.value)) return;

				// Second node (div) indicates fallback exists in all cases
				if (secondNode && secondNode.type === 'div') return;

				const startIndex = declarationValueIndex(decl);

				report({
					result,
					ruleName,
					message: messages.rejected,
					messageArgs: [firstNode.value],
					node: decl,
					index: startIndex + firstNode.sourceIndex,
					endIndex: startIndex + firstNode.sourceEndIndex,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
