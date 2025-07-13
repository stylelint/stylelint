import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'no-invalid-position-declaration';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected invalid position declaration',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-invalid-position-declaration',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		root.walkDecls((decl) => {
			if (decl.parent && decl.parent.type === 'root') {
				report({
					message: messages.rejected,
					messageArgs: [],
					node: decl,
					result,
					ruleName,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
