import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { report, ruleMessages },
} = stylelint;

const ruleName = 'plugin/fixer-undoes-its-fix';

const messages = ruleMessages(ruleName, {
	rejected: (value) => `Unexpected "${value}"`,
});

// Rejects the value its fix wrote in the pass before, so every pass changes the code
const rule = () => (root, result) => {
	root.walkDecls((decl) => {
		report({
			result,
			ruleName,
			message: messages.rejected(decl.value),
			node: decl,
			fix: () => {
				decl.value = decl.value === 'a' ? 'b' : 'a';
			},
		});
	});
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = { fixable: true };

export default createPlugin(ruleName, rule);
