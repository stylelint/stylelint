'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const getUnitFromValueNode = require('../../utils/getUnitFromValueNode');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration');
const keywordSets = require('../../reference/keywordSets');
const mediaParser = require('postcss-media-query-parser').default;
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');
const vendor = require('../../utils/vendor');
const { isRegExp, isString, assert } = require('../../utils/validateTypes');

const ruleName = 'unit-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (unit) => `Unexpected unknown unit "${unit}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/unit-no-unknown',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignoreUnits: [isString, isRegExp],
					ignoreFunctions: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		/**
		 * @template {import('postcss').AtRule | import('postcss').Declaration} T
		 * @param {T} node
		 * @param {string} value
		 * @param {(node: T) => number} getIndex
		 * @returns {void}
		 */
		function check(node, value, getIndex) {
			// make sure multiplication operations (*) are divided - not handled
			// by postcss-value-parser
			value = value.replace(/\*/g, ',');
			const parsedValue = valueParser(value);

			parsedValue.walk((valueNode) => {
				// Ignore wrong units within `url` function
				// and within functions listed in the `ignoreFunctions` option
				if (
					valueNode.type === 'function' &&
					(valueNode.value.toLowerCase() === 'url' ||
						optionsMatches(secondaryOptions, 'ignoreFunctions', valueNode.value))
				) {
					return false;
				}

				const unit = getUnitFromValueNode(valueNode);

				if (!unit) {
					return;
				}

				if (optionsMatches(secondaryOptions, 'ignoreUnits', unit)) {
					return;
				}

				if (keywordSets.units.has(unit.toLowerCase()) && unit.toLowerCase() !== 'x') {
					return;
				}

				if (unit.toLowerCase() === 'x') {
					if (
						node.type === 'atrule' &&
						node.name === 'media' &&
						node.params.toLowerCase().includes('resolution')
					) {
						let ignoreUnit = false;

						mediaParser(node.params).walk((mediaNode, _i, mediaNodes) => {
							const lastMediaNode = mediaNodes[mediaNodes.length - 1];

							if (
								mediaNode.value.toLowerCase().includes('resolution') &&
								lastMediaNode.sourceIndex === valueNode.sourceIndex
							) {
								ignoreUnit = true;

								return false;
							}
						});

						if (ignoreUnit) {
							return;
						}
					}

					if (node.type === 'decl') {
						if (node.prop.toLowerCase() === 'image-resolution') {
							return;
						}

						if (/^(?:-webkit-)?image-set[\s(]/i.test(value)) {
							const imageSet = parsedValue.nodes.find(
								(n) => vendor.unprefixed(n.value) === 'image-set',
							);

							assert(imageSet);
							assert('nodes' in imageSet);
							const imageSetLastNode = imageSet.nodes[imageSet.nodes.length - 1];
							const imageSetValueLastIndex = imageSetLastNode.sourceIndex;

							if (imageSetValueLastIndex >= valueNode.sourceIndex) {
								return;
							}
						}
					}
				}

				report({
					index: getIndex(node) + valueNode.sourceIndex,
					message: messages.rejected(unit),
					node,
					result,
					ruleName,
				});
			});
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) {
				return;
			}

			check(atRule, atRule.params, atRuleParamIndex);
		});
		root.walkDecls((decl) => {
			if (!isStandardSyntaxDeclaration(decl)) {
				return;
			}

			check(decl, decl.value, declarationValueIndex);
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
