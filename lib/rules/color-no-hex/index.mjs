import valueParser from 'postcss-value-parser';

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { isValueFunction, isValueWord } from '../../utils/typeGuards.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import isUrlFunction from '../../utils/isUrlFunction.mjs';
import { mayIncludeRegexes } from '../../utils/regexes.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'color-no-hex';

const messages = ruleMessages(ruleName, {
	rejected: (hex) => `Disallowed hex color "${hex}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/color-no-hex',
};

const HEX = /^#[\da-z]+$/i;

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignoreFunctions: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			if (!mayIncludeRegexes.hexColor.test(decl.value)) return;

			const parsedValue = valueParser(getDeclarationValue(decl));

			parsedValue.walk((node) => {
				const { value } = node;

				if (isUrlFunction(node)) return false;

				if (isValueFunction(node) && optionsMatches(secondaryOptions, 'ignoreFunctions', value)) {
					return false;
				}

				if (!isHexColor(node)) return;

				const index = declarationValueIndex(decl) + node.sourceIndex;
				const endIndex = index + value.length;

				report({
					message: messages.rejected,
					messageArgs: [value],
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
				});
			});
		});
	};
};

/**
 * @param {import('postcss-value-parser').Node} node
 */
function isHexColor(node) {
	return isValueWord(node) && HEX.test(node.value);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
