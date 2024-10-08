// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const isKeyframeRule = require('../../utils/isKeyframeRule.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'rule-selector-property-disallowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (selector, property) => `Unexpected property "${property}" for selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/rule-selector-property-disallowed-list',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [validateObjectWithArrayProps(validateTypes.isString, validateTypes.isRegExp)],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['keyframe-selectors'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const ignoreKeyframeSelectors = optionsMatches(
			secondaryOptions,
			'ignore',
			'keyframe-selectors',
		);

		const selectors = Object.keys(primary);

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			if (ignoreKeyframeSelectors && isKeyframeRule(ruleNode)) {
				return;
			}

			const selectorKey = selectors.find((selector) =>
				matchesStringOrRegExp(ruleNode.selector, selector),
			);

			if (!selectorKey) {
				return;
			}

			const disallowedProperties = primary[selectorKey];

			if (!disallowedProperties) {
				return;
			}

			ruleNode.walkDecls((decl) => {
				if (!declarationIsAChildOfRule(decl, ruleNode)) return;

				const { prop } = decl;

				if (matchesStringOrRegExp(prop, disallowedProperties)) {
					report({
						message: messages.rejected,
						messageArgs: [ruleNode.selector, prop],
						node: decl,
						result,
						ruleName,
						word: prop,
					});
				}
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

/**
 * Check that a given declaration is a child of this rule and not a nested rule
 *
 * @param {import('postcss').Declaration} decl
 * @param {import('postcss').Rule} ruleNode
 */
function declarationIsAChildOfRule(decl, ruleNode) {
	/** @type {import('postcss').Container['parent']} */
	let parent = decl.parent;

	while (parent) {
		if (parent === ruleNode) return true;

		if (parent.type === 'rule') return false;

		parent = parent.parent;
	}

	return false;
}

module.exports = rule;
