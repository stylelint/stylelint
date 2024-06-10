import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'plugin/selector-no-qux';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected "qux" in selector "${selector}"`,
});

const rule = (primary, _, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [true],
		});

		if (!validOptions) return;

		root.walkRules((ruleNode) => {
			const { selector } = ruleNode;

			if (!selector.includes('qux')) return;

			if (context.fix) {
				ruleNode.selector = selector.replace('qux', 'baz');

				return;
			}

			report({
				result,
				ruleName,
				message: messages.rejected(selector),
				node: ruleNode,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;

export default createPlugin(ruleName, rule);
