'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const isStandardSyntaxFunction = require('../../utils/isStandardSyntaxFunction');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');
const vendor = require('../../utils/vendor');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'function-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected function "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/function-allowed-list',
};

/** @type {import('stylelint').Rule<string | RegExp | Array<string | RegExp>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString, isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			valueParser(decl.value).walk((node) => {
				if (node.type !== 'function') {
					return;
				}

				if (!isStandardSyntaxFunction(node)) {
					return;
				}

				if (matchesStringOrRegExp(vendor.unprefixed(node.value), primary)) {
					return;
				}

				const index = declarationValueIndex(decl) + node.sourceIndex;
				const endIndex = index + node.value.length;

				report({
					message: messages.rejected,
					messageArgs: [node.value],
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
				});
			});
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
