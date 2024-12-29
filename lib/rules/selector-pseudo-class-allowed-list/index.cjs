// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const getAtRuleParams = require('../../utils/getAtRuleParams.cjs');
const getRuleSelector = require('../../utils/getRuleSelector.cjs');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp.cjs');
const parseSelector = require('../../utils/parseSelector.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');
const vendor = require('../../utils/vendor.cjs');

const ruleName = 'selector-pseudo-class-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected pseudo-class "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-pseudo-class-allowed-list',
};

/** @import {AtRule, Rule} from 'postcss' */

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateTypes.isString, validateTypes.isRegExp],
		});

		if (!validOptions) return;

		/**
		 * @param {string} selector
		 * @param {AtRule | Rule} node
		 * @param {number} [offset]
		 */
		function check(selector, node, offset = 0) {
			parseSelector(selector, result, node)?.walkPseudos(({ value, sourceIndex }) => {
				// Ignore pseudo-elements
				if (value.slice(0, 2) === '::') return;

				const name = value.slice(1);

				if (matchesStringOrRegExp(name, primary)) return;

				if (matchesStringOrRegExp(vendor.unprefixed(name), primary)) return;

				const index = offset + sourceIndex;

				report.default({
					message: messages.rejected,
					messageArgs: [value],
					node,
					result,
					ruleName,
					index,
					endIndex: index + value.length,
				});
			});
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			const selector = getRuleSelector(ruleNode);

			if (!selector.includes(':')) return;

			check(selector, ruleNode);
		});

		root.walkAtRules('page', (atRuleNode) => {
			if (!isStandardSyntaxAtRule(atRuleNode)) return;

			const params = getAtRuleParams(atRuleNode);

			if (!params.includes(':')) return;

			check(params, atRuleNode, nodeFieldIndices.atRuleParamIndex(atRuleNode));
		});
	};
};

rule.primaryOptionArray = true;
rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
