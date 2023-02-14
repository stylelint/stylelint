'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps');
const validateOptions = require('../../utils/validateOptions');
const { isString, isRegExp } = require('../../utils/validateTypes');
const vendor = require('../../utils/vendor');

const ruleName = 'declaration-property-value-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (property, value) => `Unexpected value "${value}" for property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-property-value-allowed-list',
};

/** @type {import('stylelint').Rule<Record<string, string | RegExp | Array<string | RegExp>>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateObjectWithArrayProps(isString, isRegExp)],
		});

		if (!validOptions) {
			return;
		}

		const propKeys = Object.keys(primary);

		root.walkDecls((decl) => {
			const { prop, value } = decl;

			const unprefixedProp = vendor.unprefixed(prop);
			const propPatterns = propKeys.filter((key) => matchesStringOrRegExp(unprefixedProp, key));

			if (propPatterns.length === 0) {
				return;
			}

			if (propPatterns.some((pattern) => optionsMatches(primary, pattern, value))) {
				return;
			}

			const index = declarationValueIndex(decl);
			const endIndex = index + decl.value.length;

			report({
				message: messages.rejected,
				messageArgs: [prop, value],
				node: decl,
				index,
				endIndex,
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
