import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import report from '../../utils/report.mjs';
import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'plugin/fixes';

const messages = ruleMessages(ruleName, {
	rejected: (value, property) => `Unexpected "${value}" for "${property}"`,
});

const rule = (primary, _, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [true],
		});

		if (!validOptions) return;

		root.walkDecls((node) => {
			if (node.prop === 'always') {
				node.value = 'fixed';

				return;
			}

			if (context.fix && node.prop === 'when-context') {
				node.value = 'fixed';
			}

			if (node.prop === 'when-fixer') {
				const index = declarationValueIndex(node);
				const endIndex = index + node.value.length;

				report({
					result,
					ruleName,
					message: messages.rejected(node.value, node.prop),
					node,
					index,
					endIndex,
					fix: () => {
						node.value = 'fixed';
					},
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = { fixable: true };

export default createPlugin(ruleName, rule);
