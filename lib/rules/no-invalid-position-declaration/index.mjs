import findNodeUpToRoot from '../../utils/findNodeUpToRoot.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

import { nestingSupportedAtKeywords } from '../../reference/atKeywords.mjs';

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

			const reportInvalid = () => {
				report({
					message: messages.rejected,
					messageArgs: [],
					node: decl,
					result,
					ruleName,
				});
			};

			// Declaration at root level is invalid
			if (parent && parent.type === 'root') {
				reportInvalid();

				return;
			}

			// Check declarations inside at-rules
			if (parent && parent.type === 'atrule') {
				const atRuleName = parent.name.toLowerCase();

				// @apply never allows declarations
				if (atRuleName === 'apply') {
					reportInvalid();

					return;
				}

				// Nesting-supported at-rules only allow declarations when nested inside a rule
				if (nestingSupportedAtKeywords.has(atRuleName)) {
					const parentRule = findNodeUpToRoot(decl, (node) => node.type === 'rule');

					if (!parentRule) {
						reportInvalid();
					}
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
