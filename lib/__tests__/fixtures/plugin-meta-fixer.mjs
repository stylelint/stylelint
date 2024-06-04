import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'plugin/selector-no-foo';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected "foo" in selector "${selector}"`,
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
			const i = selector.indexOf('foo');

			if (i === -1) return;

			const range = ruleNode.rangeBy({
				index: i,
				endIndex: i + 'foo'.length,
			});
			let fix;

			if (context.fix) {
				fix = () => {
					ruleNode.selector = selector.replace('foo', 'bar');

					return range;
				};
			}

			report({
				result,
				ruleName,
				message: messages.rejected(selector),
				node: ruleNode,
				...range,
				fix,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = { fixer: true };

export default createPlugin(ruleName, rule);
