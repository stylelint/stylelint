import report from '../../utils/report.mjs';
import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { ruleMessages },
} = stylelint;

const ruleName = 'plugin/fixer-assigns-value';

const messages = ruleMessages(ruleName, {
	expected: (actual) => `Expected "${actual}" to be a hex color`,
});

// Assigns `decl.value` rather than calling `setDeclarationValue`, as a plugin may
const rule = () => (root, result) => {
	root.walkDecls('color', (decl) => {
		if (decl.value.startsWith('#')) return;

		report({
			result,
			ruleName,
			message: messages.expected(decl.value),
			node: decl,
			fix: () => {
				decl.value = '#ffffff';
			},
		});
	});
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = { fixable: true };

export default createPlugin(ruleName, rule);
