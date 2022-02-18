'use strict';

const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const valueParser = require('postcss-value-parser');
const vendor = require('../../utils/vendor');

const ruleName = 'declaration-property-max-values';

const messages = ruleMessages(ruleName, {
	rejected: (property, max) =>
		`Expected "${property}" to have no more than ${max} ${max === 1 ? 'value' : 'values'}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/declaration-property-max-values',
};

/** @type {import('stylelint').Rule<Record<string, Number>>} */
const rule = (primary) => {
	return (root, result) => {
		root.walkDecls((decl) => {
			const prop = decl.prop;
			const value = decl.value;
			const propLength = valueParser(value).nodes.filter((node) => node.type === 'word').length;

			const unprefixedProp = vendor.unprefixed(prop);
			const propKey = Object.keys(primary).find((propIdentifier) =>
				matchesStringOrRegExp(unprefixedProp, propIdentifier),
			);

			if (!propKey) {
				return;
			}

			const max = primary[propKey];

			if (!max) {
				return;
			}

			if (propLength <= max) {
				return;
			}

			report({
				message: messages.rejected(prop, max),
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
