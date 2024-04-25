import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import { levelOneAndTwoPseudoElements } from '../../reference/selectors.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-pseudo-element-colon-notation';

const messages = ruleMessages(ruleName, {
	expected: (q) => `Expected ${q} colon pseudo-element notation`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-pseudo-element-colon-notation',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
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

			const selector = ruleNode.selector;

			// get out early if no pseudo elements or classes
			if (!selector.includes(':')) {
				return;
			}

			const selectorRoot = parseSelector(selector, result, ruleNode);

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

				if (context.fix) {
					pseudo.replaceWith(pseudo.clone({ value: fixedColon + pseudoElement }));

					return;
				}

				report({
					message: messages.expected(primary),
					node: ruleNode,
					index: pseudo.sourceIndex,
					endIndex: pseudo.sourceIndex + (isDouble ? 2 : 1),
					result,
					ruleName,
				});
			});

			if (context.fix) {
				ruleNode.selector = selectorRoot.toString();
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
