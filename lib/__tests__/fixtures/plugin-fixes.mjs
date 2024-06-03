import stylelint from '../../index.mjs';

const {
	createPlugin,
	utils: { ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'plugin/fixes';

const messages = ruleMessages(ruleName, {});

const rule = (primary, _, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [true],
		});

		if (!validOptions) return;

		root.walkDecls((node) => {
			if (node.prop === 'always') {
				node.value = 'fixed';

				return;
			}

			if (context.fix && node.prop === 'when-context') {
				node.value = 'fixed';
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;

export default createPlugin(ruleName, rule);
