'use strict';

const isCustomProperty = require('../../utils/isCustomProperty');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'custom-property-pattern';

const messages = ruleMessages(ruleName, {
	expected: (pattern) => `Expected custom property name to match pattern "${pattern}"`,
});

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isRegExp, isString],
		});

		if (!validOptions) {
			return;
		}

		const regexpPattern = isString(primary) ? new RegExp(primary) : primary;

		root.walkDecls((decl) => {
			const prop = decl.prop;

			if (!isCustomProperty(prop)) {
				return;
			}

			if (regexpPattern.test(prop.slice(2))) {
				return;
			}

			report({
				message: messages.expected(primary),
				node: decl,
				result,
				ruleName,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
