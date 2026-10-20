import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'plugin/bom';

const messages = ruleMessages(ruleName, {
	expected: 'Expected Unicode BOM',
	rejected: 'Unexpected Unicode BOM',
});

const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'never'],
		});

		if (!validOptions || !root.source) return;

		const { input } = root.source;

		if (input.hasBOM === (primary === 'always')) return;

		report({
			result,
			ruleName,
			message: primary === 'always' ? messages.expected : messages.rejected,
			node: root,
			fix: () => {
				input.hasBOM = primary === 'always';
			},
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = { fixable: true };

export default createPlugin(ruleName, rule);
