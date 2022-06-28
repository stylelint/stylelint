'use strict';

const ruleMessages = require('../../utils/ruleMessages');
const selectorListCommaWhitespaceChecker = require('../selectorListCommaWhitespaceChecker');
const validateOptions = require('../../utils/validateOptions');
const whitespaceChecker = require('../../utils/whitespaceChecker');

const ruleName = 'selector-list-comma-newline-before';

const messages = ruleMessages(ruleName, {
	expectedBefore: () => 'Expected newline before ","',
	expectedBeforeMultiLine: () => 'Expected newline before "," in a multi-line list',
	rejectedBeforeMultiLine: () => 'Unexpected whitespace before "," in a multi-line list',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-list-comma-newline-before',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	const checker = whitespaceChecker('newline', primary, messages);

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['always', 'always-multi-line', 'never-multi-line'],
		});

		if (!validOptions) {
			return;
		}

		/** @type {Map<import('postcss').Rule, number[]> | undefined} */
		let fixData;

		selectorListCommaWhitespaceChecker({
			root,
			result,
			locationChecker: checker.beforeAllowingIndentation,
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
					let beforeSelector = selector.slice(0, index);
					const afterSelector = selector.slice(index);

					if (primary.startsWith('always')) {
						const spaceIndex = beforeSelector.search(/\s+$/);

						if (spaceIndex >= 0) {
							beforeSelector =
								beforeSelector.slice(0, spaceIndex) +
								context.newline +
								beforeSelector.slice(spaceIndex);
						} else {
							beforeSelector += context.newline;
						}
					} else if (primary === 'never-multi-line') {
						beforeSelector = beforeSelector.replace(/\s*$/, '');
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
