'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const declarationValueIndex = require('../../utils/declarationValueIndex.cjs');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const vendor = require('../../utils/vendor.cjs');

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
			possible: [validateObjectWithArrayProps(validateTypes.isString, validateTypes.isRegExp)],
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