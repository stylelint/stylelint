// @ts-nocheck

'use strict';

const _ = require('lodash');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isPlainObject } = require('../../utils/validateTypes');

const ruleName = 'declaration-property-value-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (property, value) => `Unexpected value "${value}" for property "${property}"`,
});

function rule(list) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: list,
			possible: [isPlainObject],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const prop = decl.prop;
			const value = decl.value;

			const unprefixedProp = vendor.unprefixed(prop);
			const propList = _.find(list, (values, propIdentifier) =>
				matchesStringOrRegExp(unprefixedProp, propIdentifier),
			);

			if (!propList || propList.length === 0) {
				return;
			}

			if (matchesStringOrRegExp(value, propList)) {
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
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
