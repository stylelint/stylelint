import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { report, ruleMessages },
} = stylelint;

const ruleName = 'plugin/warn-once-per-result';

const messages = ruleMessages(ruleName, {
	warned: 'Warned once',
});

// Keys per-lint state on the result, as some plugins do
const seen = new WeakSet();

const rule = () => (root, result) => {
	if (seen.has(result)) return;

	seen.add(result);
	report({ result, ruleName, message: messages.warned, node: root });
};

rule.ruleName = ruleName;
rule.messages = messages;

export default createPlugin(ruleName, rule);
