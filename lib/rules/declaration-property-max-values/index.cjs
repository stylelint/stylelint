'use strict';

const valueParser = require('postcss-value-parser');
const validateTypes = require('../../utils/validateTypes.cjs');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateObjectWithProps = require('../../utils/validateObjectWithProps.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const vendor = require('../../utils/vendor.cjs');

const ruleName = 'declaration-property-max-values';

const messages = ruleMessages(ruleName, {
	rejected: (property, max) =>
		`Expected "${property}" to have no more than ${max} ${max === 1 ? 'value' : 'values'}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-property-max-values',
};

/**
 * @param {valueParser.Node} node
 */
const isValueNode = (node) => {
	return node.type === 'word' || node.type === 'function' || node.type === 'string';
};

/** @type {import('stylelint').Rule<Record<string, number>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateObjectWithProps(validateTypes.isNumber)],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const { prop, value } = decl;
			const propLength = valueParser(value).nodes.filter(isValueNode).length;

			const unprefixedProp = vendor.unprefixed(prop);
			const propKey = Object.keys(primary).find((propIdentifier) =>
				matchesStringOrRegExp(unprefixedProp, propIdentifier),
			);

			if (!propKey) {
				return;
			}

			const max = primary[propKey];

			validateTypes.assertNumber(max);

			if (propLength <= max) {
				return;
			}

			report({
				message: messages.rejected,
				messageArgs: [prop, max],
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

module.exports = rule;