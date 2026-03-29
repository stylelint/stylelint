import {
	flowRelativeProperties,
	physicalToFlowRelativeProperties,
} from '../../reference/properties.mjs';
import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'property-layout-mappings';

const messages = ruleMessages(ruleName, {
	rejected: (type, property) => `Unexpected ${type} property "${property}"`,
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/property-layout-mappings',
	fixable: true,
};

/** @type {ReadonlyMap<string, string>} */
const bothSwappedProperties = new Map([
	['border-top-left-radius', 'border-end-end-radius'],
	['border-top-right-radius', 'border-end-start-radius'],
	['border-bottom-left-radius', 'border-start-end-radius'],
	['border-bottom-right-radius', 'border-start-start-radius'],
]);

/** @type {ReadonlyMap<string, string>} */
const inlineSwappedProperties = new Map([
	...[...physicalToFlowRelativeProperties.entries()]
		.filter(
			([, flowRelative]) =>
				flowRelative.includes('-inline-start') || flowRelative.includes('-inline-end'),
		)
		.map(
			([physical, flowRelative]) =>
				/** @type {[string, string]} */ ([
					physical,
					flowRelative.includes('-inline-start')
						? flowRelative.replace('-inline-start', '-inline-end')
						: flowRelative.replace('-inline-end', '-inline-start'),
				]),
		),
	['border-top-left-radius', 'border-start-end-radius'],
	['border-top-right-radius', 'border-start-start-radius'],
	['border-bottom-left-radius', 'border-end-end-radius'],
	['border-bottom-right-radius', 'border-end-start-radius'],
]);

/** @type {ReadonlyMap<string, string>} */
const blockSwappedProperties = new Map([
	...[...physicalToFlowRelativeProperties.entries()]
		.filter(
			([, flowRelative]) =>
				flowRelative.includes('-block-start') || flowRelative.includes('-block-end'),
		)
		.map(
			([physical, flowRelative]) =>
				/** @type {[string, string]} */ ([
					physical,
					flowRelative.includes('-block-start')
						? flowRelative.replace('-block-start', '-block-end')
						: flowRelative.replace('-block-end', '-block-start'),
				]),
		),
	['border-top-left-radius', 'border-end-start-radius'],
	['border-top-right-radius', 'border-end-end-radius'],
	['border-bottom-left-radius', 'border-start-start-radius'],
	['border-bottom-right-radius', 'border-start-end-radius'],
]);

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['flow-relative', 'physical'],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignoreProperties: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		const directionality = result.stylelint.config?.languageOptions?.directionality;

		/**
		 * @param {string} type
		 * @param {import('postcss').Declaration} decl
		 */
		function complain(type, decl) {
			report({
				message: messages.rejected,
				messageArgs: [type, decl.prop],
				word: decl.prop,
				node: decl,
				result,
				ruleName,
			});
		}

		root.walkDecls((decl) => {
			const { prop } = decl;

			if (!isStandardSyntaxProperty(prop)) return;

			if (isCustomProperty(prop)) return;

			if (optionsMatches(secondaryOptions, 'ignoreProperties', prop)) return;

			if (primary === 'physical') {
				if (!flowRelativeProperties.has(prop)) return;

				complain('flow-relative', decl);
			} else {
				const flowRelativeEquivalentProp = physicalToFlowRelativeProperties.get(prop);

				if (!flowRelativeEquivalentProp) return;

				if (!directionality?.block || !directionality?.inline) {
					complain('physical', decl);

					return;
				}

				let expectedProp = flowRelativeEquivalentProp;

				const needsInlineSwap =
					directionality.inline === 'right-to-left' || directionality.inline === 'bottom-to-top';
				const needsBlockSwap =
					directionality.block === 'bottom-to-top' || directionality.block === 'right-to-left';

				if (needsInlineSwap && needsBlockSwap) {
					expectedProp =
						bothSwappedProperties.get(prop) ??
						inlineSwappedProperties.get(prop) ??
						blockSwappedProperties.get(prop) ??
						expectedProp;
				} else if (needsInlineSwap) {
					expectedProp = inlineSwappedProperties.get(prop) ?? expectedProp;
				} else if (needsBlockSwap) {
					expectedProp = blockSwappedProperties.get(prop) ?? expectedProp;
				}

				report({
					message: messages.expected,
					messageArgs: [prop, expectedProp],
					word: prop,
					node: decl,
					result,
					ruleName,
					fix() {
						decl.prop = expectedProp;
					},
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
