// @ts-nocheck

'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const styleSearch = require('style-search');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-attribute-brackets-space-inside';

const messages = ruleMessages(ruleName, {
	expectedOpening: 'Expected single space after "["',
	rejectedOpening: 'Unexpected whitespace after "["',
	expectedClosing: 'Expected single space before "]"',
	rejectedClosing: 'Unexpected whitespace before "]"',
});

function rule(expectation, options, context) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: expectation,
			possible: ['always', 'never'],
		});

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			if (!ruleNode.selector.includes('[')) {
				return;
			}

			const selector = ruleNode.raws.selector ? ruleNode.raws.selector.raw : ruleNode.selector;

			let hasFixed;
			const fixedSelector = parseSelector(selector, result, ruleNode, (selectorTree) => {
				selectorTree.walkAttributes((attributeNode) => {
					const attributeSelectorString = attributeNode.toString();

					styleSearch({ source: attributeSelectorString, target: '[' }, (match) => {
						const nextCharIsSpace = attributeSelectorString[match.startIndex + 1] === ' ';
						const index = attributeNode.sourceIndex + match.startIndex + 1;

						if (nextCharIsSpace && expectation === 'never') {
							if (context.fix) {
								hasFixed = true;
								fixBefore(attributeNode);

								return;
							}

							complain(messages.rejectedOpening, index);
						}

						if (!nextCharIsSpace && expectation === 'always') {
							if (context.fix) {
								hasFixed = true;
								fixBefore(attributeNode);

								return;
							}

							complain(messages.expectedOpening, index);
						}
					});

					styleSearch({ source: attributeSelectorString, target: ']' }, (match) => {
						const prevCharIsSpace = attributeSelectorString[match.startIndex - 1] === ' ';
						const index = attributeNode.sourceIndex + match.startIndex - 1;

						if (prevCharIsSpace && expectation === 'never') {
							if (context.fix) {
								hasFixed = true;
								fixAfter(attributeNode);

								return;
							}

							complain(messages.rejectedClosing, index);
						}

						if (!prevCharIsSpace && expectation === 'always') {
							if (context.fix) {
								hasFixed = true;
								fixAfter(attributeNode);

								return;
							}

							complain(messages.expectedClosing, index);
						}
					});
				});
			});

			if (hasFixed) {
				if (!ruleNode.raws.selector) {
					ruleNode.selector = fixedSelector;
				} else {
					ruleNode.raws.selector.raw = fixedSelector;
				}
			}

			function complain(message, index) {
				report({
					message,
					index,
					result,
					ruleName,
					node: ruleNode,
				});
			}
		});
	};

	function fixBefore(attributeNode) {
		const rawAttrBefore =
			attributeNode.raws.spaces &&
			attributeNode.raws.spaces.attribute &&
			attributeNode.raws.spaces.attribute.before;
		const { attrBefore, setAttrBefore } = rawAttrBefore
			? {
					attrBefore: rawAttrBefore,
					setAttrBefore(fixed) {
						attributeNode.raws.spaces.attribute.before = fixed;
					},
			  }
			: {
					attrBefore:
						(attributeNode.spaces.attribute && attributeNode.spaces.attribute.before) || '',
					setAttrBefore(fixed) {
						if (!attributeNode.spaces.attribute) attributeNode.spaces.attribute = {};

						attributeNode.spaces.attribute.before = fixed;
					},
			  };

		if (expectation === 'always') {
			setAttrBefore(attrBefore.replace(/^\s*/, ' '));
		} else if (expectation === 'never') {
			setAttrBefore(attrBefore.replace(/^\s*/, ''));
		}
	}

	function fixAfter(attributeNode) {
		let key;

		if (attributeNode.operator) {
			key = attributeNode.insensitive ? 'insensitive' : 'value';
		} else {
			key = 'attribute';
		}

		const rawAfter =
			attributeNode.raws.spaces &&
			attributeNode.raws.spaces[key] &&
			attributeNode.raws.spaces[key].after;
		const { after, setAfter } = rawAfter
			? {
					after: rawAfter,
					setAfter(fixed) {
						attributeNode.raws.spaces[key].after = fixed;
					},
			  }
			: {
					after: (attributeNode.spaces[key] && attributeNode.spaces[key].after) || '',
					setAfter(fixed) {
						if (!attributeNode.spaces[key]) attributeNode.spaces[key] = {};

						attributeNode.spaces[key].after = fixed;
					},
			  };

		if (expectation === 'always') {
			setAfter(after.replace(/\s*$/, ' '));
		} else if (expectation === 'never') {
			setAfter(after.replace(/\s*$/, ''));
		}
	}
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
