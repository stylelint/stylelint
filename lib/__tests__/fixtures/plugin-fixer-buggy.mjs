import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'plugin/selector-no-qux';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected "qux" in selector "${selector}"`,
});

const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [true],
		});

		if (!validOptions) return;

		root.walkRules((ruleNode) => {
			const { selector } = ruleNode;
			const i = selector.indexOf('qux');

			if (i === -1) return;

			report({
				result,
				ruleName,
				message: messages.rejected(selector),
				fix: () => {
					ruleNode.selector = selector.replace('qux', 'baz');
				},
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = { fixable: true };

export default createPlugin(ruleName, rule);
