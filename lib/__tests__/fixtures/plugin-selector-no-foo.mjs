import stylelint from '../../index.mjs';

const { report, ruleMessages, validateOptions } = stylelint.utils;

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

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			const { selector } = ruleNode;

			if (selector.includes('foo')) {
				report({
					result,
					ruleName,
					message: messages.rejected(selector),
					node: ruleNode,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
