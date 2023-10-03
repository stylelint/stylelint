import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import matchesStringOrRegExp from '../../utils/matchesStringOrRegExp.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateObjectWithArrayProps from '../../utils/validateObjectWithArrayProps.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'rule-selector-property-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (selector, property) => `Unexpected property "${property}" for selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/rule-selector-property-disallowed-list',
};

/** @type {import('stylelint').Rule<Record<string, string | RegExp | Array<string | RegExp>>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateObjectWithArrayProps(isString, isRegExp)],
		});

		if (!validOptions) {
			return;
		}

		const selectors = Object.keys(primary);

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const selectorKey = selectors.find((selector) =>
				matchesStringOrRegExp(ruleNode.selector, selector),
			);

			if (!selectorKey) {
				return;
			}

			const disallowedProperties = primary[selectorKey];

			if (!disallowedProperties) {
				return;
			}

			ruleNode.walkDecls((decl) => {
				const { prop } = decl;

				if (matchesStringOrRegExp(prop, disallowedProperties)) {
					report({
						message: messages.rejected,
						messageArgs: [ruleNode.selector, prop],
						node: decl,
						result,
						ruleName,
						word: prop,
					});
				}
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
