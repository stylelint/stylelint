'use strict';

const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isPlainObject } = require('is-plain-object');

const ruleName = 'declaration-property-value-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (property, value) => `Unexpected value "${value}" for property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/declaration-property-value-disallowed-list',
};

/** @type {import('stylelint').Rule<Record<string, (string | RegExp)[]>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isPlainObject],
		});

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

			if (!propList || propList.length === 0) {
				return;
			}

			if (!matchesStringOrRegExp(value, propList)) {
				return;
			}

			report({
				message: messages.rejected(prop, value),
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
