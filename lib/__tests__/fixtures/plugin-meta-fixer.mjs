import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'plugin/selector-no-foo';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected "foo" in selector "${selector}"`,
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
			const i = selector.indexOf('foo');

			if (i === -1) return;

			report({
				result,
				ruleName,
				message: messages.rejected(selector),
				fix: () => {
					ruleNode.selector = selector.replace('foo', 'bar');
				},
				node: ruleNode,
				index: i,
				endIndex: i + 'foo'.length,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;

export default createPlugin(ruleName, rule);
