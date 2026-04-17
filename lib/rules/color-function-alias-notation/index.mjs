import valueParser from 'postcss-value-parser';

import {
	withAlphaAliasColorFunctions,
	withoutAlphaAliasColorFunctions,
} from '../../reference/functions.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import isStandardSyntaxColorFunction from '../../utils/isStandardSyntaxColorFunction.mjs';
import { isValueFunction } from '../../utils/typeGuards.mjs';
import { mayIncludeRegexes } from '../../utils/regexes.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setDeclarationValue from '../../utils/setDeclarationValue.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'color-function-alias-notation';

const messages = ruleMessages(ruleName, {
	expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/color-function-alias-notation',
	fixable: true,
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['with-alpha', 'without-alpha'],
		});

		if (!validOptions) return;

		const targetFunctionCall =
			primary === 'with-alpha'
				? mayIncludeRegexes.withoutAlphaAliasColorFunction
				: mayIncludeRegexes.withAlphaAliasColorFunction;
		const targetFunctionName =
			primary === 'with-alpha' ? withoutAlphaAliasColorFunctions : withAlphaAliasColorFunctions;

		root.walkDecls((decl) => {
			if (!targetFunctionCall.test(decl.value)) return;

			const parsedValue = valueParser(getDeclarationValue(decl));

			parsedValue.walk((node) => {
				if (!isValueFunction(node) || !isStandardSyntaxColorFunction(node)) return;

				const { value, sourceIndex } = node;

				if (!targetFunctionName.has(value.toLowerCase())) return;

				const fixed = primary === 'with-alpha' ? `${value}a` : value.slice(0, -1);
				const fix = () => {
					node.value = fixed;
					setDeclarationValue(decl, parsedValue.toString());
				};

				const index = declarationValueIndex(decl) + sourceIndex;
				const endIndex = index + value.length;

				report({
					message: messages.expected,
					messageArgs: [value, fixed],
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
					fix: {
						apply: fix,
						node: decl,
					},
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
