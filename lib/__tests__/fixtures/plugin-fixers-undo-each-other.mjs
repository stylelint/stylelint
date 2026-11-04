import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import report from '../../utils/report.mjs';
import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { ruleMessages },
} = stylelint;

/**
 * Two with different values undo each other's fixes.
 *
 * @param {string} expectedValue
 */
function createValueRule(expectedValue) {
	const ruleName = `plugin/value-${expectedValue}`;

	const messages = ruleMessages(ruleName, {
		expected: (actual) => `Expected "${actual}" to be "${expectedValue}"`,
	});

	const rule = () => (root, result) => {
		root.walkDecls((node) => {
			if (node.value === expectedValue) return;

			const index = declarationValueIndex(node);
			const endIndex = index + node.value.length;

			report({
				result,
				ruleName,
				message: messages.expected(node.value),
				node,
				index,
				endIndex,
				fix: () => {
					node.value = expectedValue;
				},
			});
		});
	};

	rule.ruleName = ruleName;
	rule.messages = messages;
	rule.meta = { fixable: true };

	return createPlugin(ruleName, rule);
}

export default [createValueRule('a'), createValueRule('b')];
