import addFixer from '../../utils/addFixer.mjs';
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

			if (!selector.includes('foo')) return;

			if (context.fix) {
				const {
					start,
					end: { line, column },
				} = ruleNode.source;

				return addFixer(result, ruleName, {
					source: {
						start,
						end: { line, column: column + 1 },
					},
					callback: () => {
						ruleNode.selector = '.bar';
					},
				});
			}

			report({
				result,
				ruleName,
				message: messages.rejected(selector),
				node: ruleNode,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = { fixer: true };

export default createPlugin(ruleName, rule);
