'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const getDimension = require('../../utils/getDimension');
const mediaParser = require('postcss-media-query-parser').default;
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'unit-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (unit) => `Unexpected unit "${unit}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/unit-disallowed-list',
};

/**
 * a function to retrieve only the media feature name
 * could be externalized in an utils function if needed in other code
 *
 * @param {import('postcss-media-query-parser').Child} mediaFeatureNode
 * @returns {string | undefined}
 */
const getMediaFeatureName = (mediaFeatureNode) => {
	const value = mediaFeatureNode.value.toLowerCase();

	const match = /((?:-?\w*)*)/.exec(value);

	return match ? match[1] : undefined;
};

/** @type {import('stylelint').Rule<string | string[]>} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [isString],
			},
			{
				optional: true,
				actual: secondaryOptions,
				possible: {
					ignoreProperties: [validateObjectWithArrayProps(isString, isRegExp)],
					ignoreMediaFeatureNames: [validateObjectWithArrayProps(isString, isRegExp)],
				},
			},
		);

		if (!validOptions) {
			return;
		}

		const primaryValues = [primary].flat();

		/**
		 * @param {import('postcss').Node} node
		 * @param {number} nodeIndex
		 * @param {import('postcss-value-parser').Node} valueNode
		 * @param {string | undefined} input
		 * @param {Record<string, unknown>} options
		 * @returns {void}
		 */
		function check(node, nodeIndex, valueNode, input, options) {
			const { number, unit } = getDimension(valueNode);

			// There is not unit or it is not configured as a problem
			if (!unit || !number || (unit && !primaryValues.includes(unit.toLowerCase()))) {
				return;
			}

			// The unit has an ignore option for the specific input
			if (optionsMatches(options, unit.toLowerCase(), input)) {
				return;
			}

			report({
				index: nodeIndex + valueNode.sourceIndex + number.length,
				endIndex: nodeIndex + valueNode.sourceEndIndex,
				message: messages.rejected(unit),
				node,
				result,
				ruleName,
			});
		}

		/**
		 * @template {import('postcss').AtRule} T
		 * @param {T} node
		 * @param {string} value
		 * @param {(node: T) => number} getIndex
		 * @returns {void}
		 */
		function checkMedia(node, value, getIndex) {
			mediaParser(node.params).walk(/^media-feature$/i, (mediaFeatureNode) => {
				const mediaName = getMediaFeatureName(mediaFeatureNode);
				const parentValue = mediaFeatureNode.parent.value;

				valueParser(value).walk((valueNode) => {
					// Ignore all non-word valueNode and
					// the values not included in the parentValue string
					if (valueNode.type !== 'word' || !parentValue.includes(valueNode.value)) {
						return;
					}

					check(
						node,
						getIndex(node),
						valueNode,
						mediaName,
						secondaryOptions ? secondaryOptions.ignoreMediaFeatureNames : {},
					);
				});
			});
		}

		/**
		 * @template {import('postcss').Declaration} T
		 * @param {T} node
		 * @param {string} value
		 * @param {(node: T) => number} getIndex
		 * @returns {void}
		 */
		function checkDecl(node, value, getIndex) {
			// make sure multiplication operations (*) are divided - not handled
			// by postcss-value-parser
			value = value.replace(/\*/g, ',');

			valueParser(value).walk((valueNode) => {
				// Ignore wrong units within `url` function
				if (valueNode.type === 'function' && valueNode.value.toLowerCase() === 'url') {
					return false;
				}

				check(
					node,
					getIndex(node),
					valueNode,
					node.prop,
					secondaryOptions ? secondaryOptions.ignoreProperties : {},
				);
			});
		}

		root.walkAtRules(/^media$/i, (atRule) => checkMedia(atRule, atRule.params, atRuleParamIndex));
		root.walkDecls((decl) => checkDecl(decl, decl.value, declarationValueIndex));
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
