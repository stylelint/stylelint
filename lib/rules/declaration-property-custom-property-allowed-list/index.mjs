import valueParser from 'postcss-value-parser';

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import isVarFunction from '../../utils/isVarFunction.mjs';
import matchesStringOrRegExp from '../../utils/matchesStringOrRegExp.mjs';
import { mayIncludeRegexes } from '../../utils/regexes.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateObjectWithArrayProps from '../../utils/validateObjectWithArrayProps.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'declaration-property-custom-property-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (property, customProperty) =>
		`Disallowed custom property "${customProperty}" for property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-property-custom-property-allowed-list',
};

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateObjectWithArrayProps(isString, isRegExp)],
		});

		if (!validOptions) return;

		const propKeys = Object.keys(primary);

		root.walkDecls((decl) => {
			const { prop, value: declValue } = decl;

			if (!mayIncludeRegexes.varFunction.test(declValue)) return;

			if (!isStandardSyntaxDeclaration(decl)) return;

			if (!isStandardSyntaxProperty(prop)) return;

			const propPatterns = propKeys.filter((key) => matchesStringOrRegExp(prop, key));

			if (propPatterns.length === 0) return;

			const allowedCustomProperties = propPatterns.flatMap((pattern) => primary[pattern] ?? []);

			valueParser(declValue).walk((node) => {
				if (!isVarFunction(node)) return;

				const [firstNode] = node.nodes;

				if (!firstNode) return;

				const { value, sourceIndex, sourceEndIndex } = firstNode;

				if (!isStandardSyntaxValue(value)) return;

				if (!isCustomProperty(value)) return;

				if (matchesStringOrRegExp(value, allowedCustomProperties)) return;

				const valueIndex = declarationValueIndex(decl);

				report({
					message: messages.rejected,
					messageArgs: [prop, value],
					node: decl,
					index: valueIndex + sourceIndex,
					endIndex: valueIndex + sourceEndIndex,
					result,
					ruleName,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
