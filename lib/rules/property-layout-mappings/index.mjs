import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import {
	logicalToPhysicalProperties,
	physicalToLogicalProperties,
} from '../../reference/properties.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import matchesStringOrRegExp from '../../utils/matchesStringOrRegExp.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';
import vendor from '../../utils/vendor.mjs';

const ruleName = 'property-layout-mappings';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/property-layout-mappings',
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
				possible: ['logical', 'physical'],
			},
			{
				actual: secondaryOptions,
				possible: {
					exceptProperties: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const exceptProperties = secondaryOptions?.exceptProperties ?? [];
		const isLogicalMode = primary === 'logical';

		root.walkDecls((decl) => {
			const prop = decl.prop;

			if (!isStandardSyntaxProperty(prop)) return;

			if (isCustomProperty(prop)) return;

			const unprefixedProp = vendor.unprefixed(prop);

			// Skip if property is in except list
			if (matchesStringOrRegExp([prop, unprefixedProp], exceptProperties)) return;

			let expectedProp;
			let mappingFound = false;

			if (isLogicalMode) {
				// In logical mode, flag physical properties
				if (physicalToLogicalProperties.has(unprefixedProp)) {
					expectedProp = physicalToLogicalProperties.get(unprefixedProp);
					mappingFound = true;
				}
			} else if (logicalToPhysicalProperties.has(unprefixedProp)) {
				// In physical mode, flag logical properties
				expectedProp = logicalToPhysicalProperties.get(unprefixedProp);
				mappingFound = true;
			}

			if (!mappingFound) return;

			// Preserve vendor prefix if present
			const prefix = vendor.prefix(prop);
			const expectedPropWithPrefix = prefix + expectedProp;

			report({
				message: messages.expected,
				messageArgs: [prop, expectedPropWithPrefix],
				word: prop,
				node: decl,
				result,
				ruleName,
				fix() {
					decl.prop = expectedPropWithPrefix;
				},
			});
		});
	};
};

rule.primaryOptionArray = false;
rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
