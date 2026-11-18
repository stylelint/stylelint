import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { report, ruleMessages },
} = stylelint;

const ruleName = 'plugin/fixer-changes-nothing';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected root',
});

// Its fix is counted, yet changes nothing
const rule = () => (root, result) => {
	report({
		result,
		ruleName,
		message: messages.rejected,
		node: root,
		fix: () => {},
	});
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = { fixable: true };

export default createPlugin(ruleName, rule);
