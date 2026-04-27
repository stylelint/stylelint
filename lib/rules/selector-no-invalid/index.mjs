import { parse, walk } from 'css-tree';

import { dirIdentifiers } from '../../reference/selectors.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import isKeyframeRule from '../../utils/isKeyframeRule.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import { mayIncludeRegexes } from '../../utils/regexes.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-no-invalid';

const messages = ruleMessages(ruleName, {
	rejected: (selector, reason) => `Invalid selector "${selector}"${reason ? `, ${reason}` : ''}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-no-invalid',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			if (isKeyframeRule(ruleNode)) return;

			const selector = getRuleSelector(ruleNode);

			/**
			 * @param {number} index
			 * @param {number} endIndex
			 * @param {string} subject
			 * @param {string} reason
			 */
			const complain = (index, endIndex, subject, reason) => {
				report({
					message: messages.rejected,
					messageArgs: [subject, reason],
					node: ruleNode,
					index,
					endIndex,
					ruleName,
					result,
				});
			};

			let ast;

			try {
				ast = parse(selector, { context: 'selectorList', positions: true });
			} catch (error) {
				if (!(error instanceof SyntaxError)) throw error;

				const offset = 'offset' in error && typeof error.offset === 'number' ? error.offset : 0;
				const message = error.message;

				complain(
					offset,
					Math.min(offset + 1, selector.length),
					selector,
					message.charAt(0).toLowerCase() + message.slice(1),
				);

				return;
			}

			if (!mayIncludeRegexes.dirPseudoClass.test(selector)) return;

			walk(ast, {
				visit: 'PseudoClassSelector',
				enter(node) {
					if (node.name.toLowerCase() !== 'dir') return walk.skip;

					if (!node.loc) return walk.skip;

					if (isValidDirPseudoClass(node, dirIdentifiers)) return walk.skip;

					const index = node.loc.start.offset;
					const endIndex = node.loc.end.offset;

					const reason = `expected ${[...dirIdentifiers].map((id) => `"${id}"`).join(' or ')}`;

					complain(index, endIndex, selector.slice(index, endIndex), reason);
				},
			});
		});
	};
};

/**
 * @param {import('css-tree').PseudoClassSelector} node
 * @param {ReadonlySet<string>} identifiers
 * @returns {boolean}
 */
function isValidDirPseudoClass(node, identifiers) {
	const { children } = node;

	if (children?.size !== 1) return false;

	const first = children.first;

	if (first?.type !== 'Identifier') return false;

	return identifiers.has(first.name.toLowerCase());
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
