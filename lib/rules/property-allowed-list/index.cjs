'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const isCustomProperty = require('../../utils/isCustomProperty.cjs');
const isStandardSyntaxProperty = require('../../utils/isStandardSyntaxProperty.cjs');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const vendor = require('../../utils/vendor.cjs');

const ruleName = 'property-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (property) => `Unexpected property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/property-allowed-list',
};

/** @type {import('stylelint').Rule<string | RegExp | Array<string | RegExp>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateTypes.isString, validateTypes.isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const prop = decl.prop;

			if (!isStandardSyntaxProperty(prop)) {
				return;
			}

			if (isCustomProperty(prop)) {
				return;
			}

			// either the prefix or unprefixed version is in the list
			if (matchesStringOrRegExp([prop, vendor.unprefixed(prop)], primary)) {
				return;
			}

			report({
				message: messages.rejected,
				messageArgs: [prop],
				word: prop,
				node: decl,
				result,
				ruleName,
			});
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;