'use strict';

const ruleMessages = require('../../utils/ruleMessages');
const selectorListCommaWhitespaceChecker = require('../selectorListCommaWhitespaceChecker');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'selector-list-comma-space-after';

const messages = ruleMessages(ruleName, {
	expectedAfter: () => 'Expected single space after ","',
	rejectedAfter: () => 'Unexpected whitespace after ","',
	expectedAfterSingleLine: () => 'Expected single space after "," in a single-line list',
	rejectedAfterSingleLine: () => 'Unexpected whitespace after "," in a single-line list',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-list-comma-space-after',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	const checker = whitespaceChecker('space', primary, messages);

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'never', 'always-single-line', 'never-single-line'],
		});

		if (!validOptions) {
			return;
		}

		/** @type {Map<import('postcss').Rule, number[]> | undefined} */
		let fixData;

		selectorListCommaWhitespaceChecker({
			root,
			result,
			locationChecker: checker.after,
			checkedRuleName: ruleName,
			fix: context.fix
				? (ruleNode, index) => {
						fixData = fixData || new Map();
						const commaIndices = fixData.get(ruleNode) || [];

						commaIndices.push(index);
						fixData.set(ruleNode, commaIndices);

						return true;
				  }
				: null,
		});

		if (fixData) {
			for (const [ruleNode, commaIndices] of fixData.entries()) {
				let selector = ruleNode.raws.selector ? ruleNode.raws.selector.raw : ruleNode.selector;

				for (const index of commaIndices.sort((a, b) => b - a)) {
					const beforeSelector = selector.slice(0, index + 1);
					let afterSelector = selector.slice(index + 1);

					if (primary.startsWith('always')) {
						afterSelector = afterSelector.replace(/^\s*/, ' ');
					} else if (primary.startsWith('never')) {
						afterSelector = afterSelector.replace(/^\s*/, '');
					}

					selector = beforeSelector + afterSelector;
				}

				if (ruleNode.raws.selector) {
					ruleNode.raws.selector.raw = selector;
				} else {
					ruleNode.selector = selector;
				}
			}
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
