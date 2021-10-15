// @ts-nocheck

'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const getUnitFromValueNode = require('../../utils/getUnitFromValueNode');
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

// a function to retrieve only the media feature name
// could be externalized in an utils function if needed in other code
const getMediaFeatureName = (mediaFeatureNode) => {
	const value = mediaFeatureNode.value.toLowerCase();

	return /((?:-?\w*)*)/.exec(value)[1];
};

function rule(listInput, options) {
	const list = [listInput].flat();

	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: list,
				possible: [isString],
			},
			{
				optional: true,
				actual: options,
				possible: {
					ignoreProperties: validateObjectWithArrayProps([isString, isRegExp]),
					ignoreMediaFeatureNames: validateObjectWithArrayProps([isString, isRegExp]),
				},
			},
		);

		if (!validOptions) {
			return;
		}

		function check(node, nodeIndex, valueNode, input, option) {
			const unit = getUnitFromValueNode(valueNode);

			// There is not unit or it is not configured as a problem
			if (!unit || (unit && !list.includes(unit.toLowerCase()))) {
				return;
			}

			// The unit has an ignore option for the specific input
			if (optionsMatches(option, unit.toLowerCase(), input)) {
				return;
			}

			report({
				index: nodeIndex + valueNode.sourceIndex,
				message: messages.rejected(unit),
				node,
				result,
				ruleName,
			});
		}

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
						options ? options.ignoreMediaFeatureNames : {},
					);
				});
			});
		}

		function checkDecl(node, value, getIndex) {
			// make sure multiplication operations (*) are divided - not handled
			// by postcss-value-parser
			value = value.replace(/\*/g, ',');

			valueParser(value).walk((valueNode) => {
				// Ignore wrong units within `url` function
				if (valueNode.type === 'function' && valueNode.value.toLowerCase() === 'url') {
					return false;
				}

				check(node, getIndex(node), valueNode, node.prop, options ? options.ignoreProperties : {});
			});
		}

		root.walkAtRules(/^media$/i, (atRule) => checkMedia(atRule, atRule.params, atRuleParamIndex));
		root.walkDecls((decl) => checkDecl(decl, decl.value, declarationValueIndex));
	};
}

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
