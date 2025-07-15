import { deprecatedAtKeywords, nestingSupportedAtKeywords } from '../../reference/atKeywords.mjs';
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
			const parent = decl.parent;

			// Check if declaration is at root level
			if (parent && parent.type === 'root') {
				report({
					message: messages.rejected,
					messageArgs: [],
					node: decl,
					result,
					ruleName,
				});

				return;
			}

			// Check if declaration is inside at-rules that only accept <rule-list>
			// These at-rules cannot contain declarations directly, only rules
			if (parent && parent.type === 'atrule') {
				const atRuleName = parent.name.toLowerCase();

				// At-rules that support nesting but only accept <rule-list>, not declarations
				// These at-rules only accept <rule-list> regardless of nesting level
				if (nestingSupportedAtKeywords.has(atRuleName)) {
					report({
						message: messages.rejected,
						messageArgs: [],
						node: decl,
						result,
						ruleName,
					});
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
