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

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	const list = [primary].flat();

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: list,
			possible: [isString, isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			const value = decl.value;
			const values = valueParser(value);

			values.walk((node) => {
				if (node.type !== 'function') {
					return;
				}

				if (!isStandardSyntaxFunction(node)) {
					return;
				}

				if (matchesStringOrRegExp(vendor.unprefixed(node.value), list)) {
					return;
				}

				const nextNode = values.nodes[values.nodes.indexOf(node) + 1];
				const valueIndex = declarationValueIndex(decl);
				const index = valueIndex + node.sourceIndex;
				const endIndex = valueIndex + (nextNode ? nextNode.sourceIndex : decl.value.length);

				report({
					message: messages.rejected(node.value),
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
module.exports = rule;
