import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { report, ruleMessages },
} = stylelint;

const ruleName = 'plugin/no-missing-end-of-source-newline';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected missing end-of-source newline',
});

// Reads the source text, as line-based rules in some plugins do
const rule = () => (root, result) => {
	if (root.source.input.css.endsWith('\n')) return;

	report({
		result,
		ruleName,
		message: messages.rejected,
		node: root,
		fix: () => {
			root.raws.after += '\n';
		},
	});
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = { fixable: true };

export default createPlugin(ruleName, rule);
