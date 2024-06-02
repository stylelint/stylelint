import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'plugin/fixes-always';

const messages = ruleMessages(ruleName, {});

const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [true],
		});

		if (!validOptions) return;

		root.walkRules((ruleNode) => {
			const { selector } = ruleNode;

			if (!selector.includes('foo')) return;

			ruleNode.selector = selector.replace(/foo/g, 'bar');
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;

export default createPlugin(ruleName, rule);
