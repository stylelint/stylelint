import valueParser from 'postcss-value-parser';

import hasPrefix from '../../utils/hasPrefix.mjs';
import isAutoprefixable from '../../utils/isAutoprefixable.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setDeclarationValue from '../../utils/setDeclarationValue.mjs';
import validateOptions from '../../utils/validateOptions.mjs';
import vendor from '../../utils/vendor.mjs';

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import testAgainstStringOrRegExp from '../../utils/testAgainstStringOrRegExp.mjs';

const ruleName = 'value-no-vendor-prefix';

const messages = ruleMessages(ruleName, {
	rejected: (value) => `Unexpected vendor-prefix "${value}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/value-no-vendor-prefix',
	fixable: true,
};

/** @type {import('stylelint').Rule<boolean, Array<string | RegExp>>} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				optional: true,
				actual: secondaryOptions,
				possible: {
					ignoreValues: [isString, isRegExp],
				},
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const { value } = decl;

			if (!hasPrefix(value)) return;

			if (!isStandardSyntaxDeclaration(decl) || !isStandardSyntaxProperty(decl.prop)) {
				return;
			}

			if (secondaryOptions?.ignoreValues) {
				const isIgnored = secondaryOptions.ignoreValues.some((v) => {
					const useRawValue =
						v instanceof RegExp || (isString(v) && v.startsWith('/') && v.endsWith('/'));
					/**
					 * @todo consolidate in the next major
					 * @see stylelint/stylelin#7542
					 */
					const input = useRawValue ? value : vendor.unprefixed(value);

					return Boolean(testAgainstStringOrRegExp(input, v));
				});

				if (isIgnored) return;
			}

			const parsedValue = valueParser(value);

			parsedValue.walk((node) => {
				if (!isAutoprefixable.propertyValue(node.value)) {
					return;
				}

				if (context.fix) {
					node.value = isAutoprefixable.unprefix(node.value);

					return;
				}

				const startIndex = decl.prop.length + (decl.raws.between || '').length + node.sourceIndex;

				report({
					message: messages.rejected,
					messageArgs: [node.value],
					node: decl,
					index: startIndex,
					endIndex: startIndex + node.value.length,
					result,
					ruleName,
				});
			});

			setDeclarationValue(decl, parsedValue.toString());
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
