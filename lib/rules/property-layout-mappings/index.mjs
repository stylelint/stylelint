import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import {
	logicalToPhysicalProperties,
	physicalToLogicalProperties,
} from '../../reference/properties.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

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
					dir: ['ltr', 'rtl', 'auto'],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		const isLogicalMode = primary === 'logical';

		// get directionality configuration for safe autofix
		const directionality = result.stylelint.config?.languageOptions?.directionality;

		root.walkDecls((decl) => {
			const { prop } = decl;

			if (!isStandardSyntaxProperty(prop)) return;

			if (isCustomProperty(prop)) return;

			// Check if property is in except list and reverse the primary option
			let expectLogical = isLogicalMode;

			if (optionsMatches(secondaryOptions, 'exceptProperties', prop)) {
				expectLogical = !expectLogical;
			}

			let expectedProp = '';
			let mappingFound = false;

			if (expectLogical) {
				// In logical mode, flag physical properties
				const logicalEquivalent = physicalToLogicalProperties.get(prop);

				if (logicalEquivalent) {
					expectedProp = logicalEquivalent;
					mappingFound = true;
				}
			} else {
				// In physical mode, flag logical properties
				const physicalEquivalent = logicalToPhysicalProperties.get(prop);

				if (physicalEquivalent) {
					expectedProp = physicalEquivalent;
					mappingFound = true;
				}
			}

			if (!mappingFound) return;

			report({
				message: messages.expected,
				messageArgs: [prop, expectedProp],
				word: prop,
				node: decl,
				result,
				ruleName,
				// Only autofix for logical mode when directionality is explicitly configured
				...(expectLogical &&
					directionality && {
						fix() {
							decl.prop = expectedProp;
						},
					}),
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
