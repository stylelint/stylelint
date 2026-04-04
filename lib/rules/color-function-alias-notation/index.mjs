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
import optionsMatches from '../../utils/optionsMatches.mjs';
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
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['with-alpha', 'without-alpha'],
			},
			{
				actual: secondaryOptions,
				possible: {
					except: ['with-alpha-component'],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		const exceptWithAlphaComponent = optionsMatches(
			secondaryOptions,
			'except',
			'with-alpha-component',
		);

		const targetFunctionCall = exceptWithAlphaComponent
			? mayIncludeRegexes.colorFunction
			: primary === 'with-alpha'
				? mayIncludeRegexes.withoutAlphaAliasColorFunction
				: mayIncludeRegexes.withAlphaAliasColorFunction;

		root.walkDecls((decl) => {
			if (!targetFunctionCall.test(decl.value)) return;

			const parsedValue = valueParser(getDeclarationValue(decl));

			parsedValue.walk((node) => {
				if (!isValueFunction(node) || !isStandardSyntaxColorFunction(node)) return;

				const { value, sourceIndex } = node;
				const lowerCaseValue = value.toLowerCase();

				if (
					!withAlphaAliasColorFunctions.has(lowerCaseValue) &&
					!withoutAlphaAliasColorFunctions.has(lowerCaseValue)
				) {
					return;
				}

				let expected = primary;

				if (exceptWithAlphaComponent && hasAlphaComponent(node)) {
					expected = primary === 'with-alpha' ? 'without-alpha' : 'with-alpha';
				}

				const targetFunctionName =
					expected === 'with-alpha'
						? withoutAlphaAliasColorFunctions
						: withAlphaAliasColorFunctions;

				if (!targetFunctionName.has(lowerCaseValue)) return;

				const fixed = expected === 'with-alpha' ? `${value}a` : value.slice(0, -1);
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

function hasAlphaComponent(node) {
	let commaCount = 0;

	for (const childNode of node.nodes) {
		if (childNode.type !== 'div') continue;

		if (childNode.value === '/') return true;
		if (childNode.value === ',') commaCount += 1;
	}

	return commaCount === 3;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
