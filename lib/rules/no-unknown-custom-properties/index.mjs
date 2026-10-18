import valueParser from 'postcss-value-parser';

import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import getDeclaredCustomPropertyNames from '../../utils/getDeclaredCustomPropertyNames.mjs';
import { isValueDiv } from '../../utils/typeGuards.mjs';
import isVarFunction from '../../utils/isVarFunction.mjs';
import memoizeForReferenceRoots from '../../utils/memoizeForReferenceRoots.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'no-unknown-custom-properties';

const messages = ruleMessages(ruleName, {
	rejected: (property) => `Unknown custom property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-unknown-custom-properties',
};

const getDeclaredCustomPropertyNamesOfRoots = memoizeForReferenceRoots(
	getDeclaredCustomPropertyNames,
);

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		const declaredCustomProperties = getDeclaredCustomPropertyNamesOfRoots(
			root,
			result.stylelint.referenceRoots,
		);

		/** @param {string} name */
		const isDeclared = (name) => declaredCustomProperties.some((declared) => declared.has(name));

		root.walkDecls((decl) => {
			const { value } = decl;

			const parsedValue = valueParser(value);

			parsedValue.walk((node) => {
				if (!isVarFunction(node)) return;

				const [firstNode, secondNode] = node.nodes;

				if (!firstNode || isDeclared(firstNode.value)) return;

				// Second node (div) indicates fallback exists in all cases
				if (isValueDiv(secondNode)) return;

				const startIndex = declarationValueIndex(decl);

				report({
					result,
					ruleName,
					message: messages.rejected,
					messageArgs: [firstNode.value],
					node: decl,
					index: startIndex + firstNode.sourceIndex,
					endIndex: startIndex + firstNode.sourceEndIndex,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
