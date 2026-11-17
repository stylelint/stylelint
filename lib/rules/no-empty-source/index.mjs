import { isConfigurationComment } from '../../utils/configurationComment.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'no-empty-source';

const messages = ruleMessages(ruleName, {
	rejected: 'Empty source',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-empty-source',
};

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		let hasNotableChild = root.nodes.some(
			(child) => !isConfigurationComment(child, context.configurationComment),
		);

		if (!hasNotableChild) {
			// Assume a case when a non-standard syntax is used, such as JSX. See #8547.
			if (root.nodes.length === 0 && Boolean(root.raws.after?.trim())) {
				hasNotableChild = true;
			}
		}

		if (hasNotableChild) {
			return;
		}

		report({
			message: messages.rejected,
			messageArgs: [],
			node: root,
			result,
			ruleName,
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
