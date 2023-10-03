import valueParser from 'postcss-value-parser';

import hasPrefix from '../../utils/hasPrefix.mjs';
import isAutoprefixable from '../../utils/isAutoprefixable.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import { isString } from '../../utils/validateTypes.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setDeclarationValue from '../../utils/setDeclarationValue.mjs';
import validateOptions from '../../utils/validateOptions.mjs';
import vendor from '../../utils/vendor.mjs';

const ruleName = 'value-no-vendor-prefix';

const messages = ruleMessages(ruleName, {
	rejected: (value) => `Unexpected vendor-prefix "${value}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/value-no-vendor-prefix',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
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
					ignoreValues: [isString],
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

			if (optionsMatches(secondaryOptions, 'ignoreValues', vendor.unprefixed(value))) {
				return;
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
