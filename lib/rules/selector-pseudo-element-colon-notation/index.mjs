import getRuleSelector from '../../utils/getRuleSelector.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import { levelOneAndTwoPseudoElements } from '../../reference/selectors.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-pseudo-element-colon-notation';

const messages = ruleMessages(ruleName, {
	expected: (type) => `Expected ${type} colon pseudo-element notation`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-pseudo-element-colon-notation',
	fixable: true,
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['single', 'double'],
		});

		if (!validOptions) {
			return;
		}

		let fixedColon = '';

		if (primary === 'single') {
			fixedColon = ':';
		} else if (primary === 'double') {
			fixedColon = '::';
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			// get out early if no pseudo elements or classes
			if (!ruleNode.selector.includes(':')) {
				return;
			}

			const selectorRoot = parseSelector(getRuleSelector(ruleNode), result, ruleNode);

			if (!selectorRoot) return;

			selectorRoot.walkPseudos((pseudo) => {
				const pseudoElement = pseudo.value.replaceAll(':', '');

				if (!levelOneAndTwoPseudoElements.has(pseudoElement.toLowerCase())) {
					return;
				}

				const isDouble = pseudo.value.startsWith('::');

				if (primary === 'single' && !isDouble) {
					return;
				}

				if (primary === 'double' && isDouble) {
					return;
				}

				const fix = () => {
					pseudo.replaceWith(pseudo.clone({ value: fixedColon + pseudoElement }));
					ruleNode.selector = selectorRoot.toString();
				};

				report({
					message: messages.expected,
					messageArgs: [primary],
					node: ruleNode,
					index: pseudo.sourceIndex,
					endIndex: pseudo.sourceIndex + (isDouble ? 2 : 1),
					result,
					ruleName,
					fix,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
