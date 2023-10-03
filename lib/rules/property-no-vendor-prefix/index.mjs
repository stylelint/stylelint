import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import isAutoprefixable from '../../utils/isAutoprefixable.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';
import vendor from '../../utils/vendor.mjs';

const ruleName = 'property-no-vendor-prefix';

const messages = ruleMessages(ruleName, {
	rejected: (property) => `Unexpected vendor-prefix "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/property-no-vendor-prefix',
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
					ignoreProperties: [isString, isRegExp],
				},
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const prop = decl.prop;
			const unprefixedProp = vendor.unprefixed(prop);

			//return early if property is to be ignored
			if (optionsMatches(secondaryOptions, 'ignoreProperties', unprefixedProp)) {
				return;
			}

			// Make sure there's a vendor prefix,
			// but this isn't a custom property

			if (prop[0] !== '-' || prop[1] === '-') {
				return;
			}

			if (!isAutoprefixable.property(prop)) {
				return;
			}

			if (context.fix) {
				decl.prop = isAutoprefixable.unprefix(decl.prop);

				return;
			}

			report({
				message: messages.rejected,
				messageArgs: [prop],
				word: prop,
				node: decl,
				result,
				ruleName,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
