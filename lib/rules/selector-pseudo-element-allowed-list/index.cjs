// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const getRuleSelector = require('../../utils/getRuleSelector.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp.cjs');
const parseSelector = require('../../utils/parseSelector.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const vendor = require('../../utils/vendor.cjs');

const ruleName = 'selector-pseudo-element-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected pseudo-element "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-pseudo-element-allowed-list',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateTypes.isString, validateTypes.isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			if (!ruleNode.selector.includes('::')) {
				return;
			}

			parseSelector(getRuleSelector(ruleNode), result, ruleNode)?.walkPseudos((pseudoNode) => {
				const value = pseudoNode.value;

				// Ignore pseudo-classes
				if (value.charAt(1) !== ':') {
					return;
				}

				const name = value.slice(2);

				// Pseudo is in allowlist
				if (matchesStringOrRegExp(name, primary)) {
					return;
				}

				// Unprefixed-pseudo is in allowlist
				if (matchesStringOrRegExp(vendor.unprefixed(name), primary)) {
					return;
				}

				const index = pseudoNode.sourceIndex;
				const endIndex = index + value.length;

				report({
					index,
					endIndex,
					message: messages.rejected,
					messageArgs: [value],
					node: ruleNode,
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
