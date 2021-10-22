'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const getUnitFromValueNode = require('../../utils/getUnitFromValueNode');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');
const vendor = require('../../utils/vendor');
const { isPlainObject } = require('is-plain-object');

const ruleName = 'declaration-property-unit-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (property, unit) => `Unexpected unit "${unit}" for property "${property}"`,
});

/** @type {import('stylelint').Rule<Record<string, string[]>>} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [isPlainObject],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['inside-function'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const prop = decl.prop;
			const value = decl.value;

			const unprefixedProp = vendor.unprefixed(prop);

			const propKey = Object.keys(primary).find((propIdentifier) =>
				matchesStringOrRegExp(unprefixedProp, propIdentifier),
			);

			if (!propKey) {
				return;
			}

			const propList = primary[propKey];

			if (!propList) {
				return;
			}

			valueParser(value).walk((node) => {
				// Ignore wrong units within `url` function
				if (node.type === 'function') {
					if (node.value.toLowerCase() === 'url') {
						return false;
					}

					if (optionsMatches(secondaryOptions, 'ignore', 'inside-function')) {
						return false;
					}
				}

				if (node.type === 'string') {
					return;
				}

				const unit = getUnitFromValueNode(node);

				if (!unit || (unit && propList.indexOf(unit.toLowerCase())) !== -1) {
					return;
				}

				report({
					message: messages.rejected(prop, unit),
					node: decl,
					index: declarationValueIndex(decl) + node.sourceIndex,
					result,
					ruleName,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
