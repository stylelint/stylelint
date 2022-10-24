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

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-attribute-brackets-space-inside',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
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

						if (nextCharIsSpace && primary === 'never') {
							if (context.fix) {
								hasFixed = true;
								fixBefore(attributeNode);

								return;
							}

							complain(messages.rejectedOpening, index);
						}

						if (!nextCharIsSpace && primary === 'always') {
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

						if (prevCharIsSpace && primary === 'never') {
							if (context.fix) {
								hasFixed = true;
								fixAfter(attributeNode);

								return;
							}

							complain(messages.rejectedClosing, index);
						}

						if (!prevCharIsSpace && primary === 'always') {
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

			if (hasFixed && fixedSelector) {
				if (!ruleNode.raws.selector) {
					ruleNode.selector = fixedSelector;
				} else {
					ruleNode.raws.selector.raw = fixedSelector;
				}
			}

			/**
			 * @param {string} message
			 * @param {number} index
			 */
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

	/**
	 * @param {import('postcss-selector-parser').Attribute} attributeNode
	 */
	function fixBefore(attributeNode) {
		const spacesAttribute = attributeNode.raws.spaces && attributeNode.raws.spaces.attribute;
		const rawAttrBefore = spacesAttribute && spacesAttribute.before;

		/** @type {{ attrBefore: string, setAttrBefore: (fixed: string) => void }} */
		const { attrBefore, setAttrBefore } = rawAttrBefore
			? {
					attrBefore: rawAttrBefore,
					setAttrBefore(fixed) {
						spacesAttribute.before = fixed;
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

		if (primary === 'always') {
			setAttrBefore(attrBefore.replace(/^\s*/, ' '));
		} else if (primary === 'never') {
			setAttrBefore(attrBefore.replace(/^\s*/, ''));
		}
	}

	/**
	 * @param {import('postcss-selector-parser').Attribute} attributeNode
	 */
	function fixAfter(attributeNode) {
		const key = attributeNode.operator
			? attributeNode.insensitive
				? 'insensitive'
				: 'value'
			: 'attribute';

		const rawSpaces = attributeNode.raws.spaces && attributeNode.raws.spaces[key];
		const rawAfter = rawSpaces && rawSpaces.after;

		const spaces = attributeNode.spaces[key];

		/** @type {{ after: string, setAfter: (fixed: string) => void }} */
		const { after, setAfter } = rawAfter
			? {
					after: rawAfter,
					setAfter(fixed) {
						rawSpaces.after = fixed;
					},
			  }
			: {
					after: (spaces && spaces.after) || '',
					setAfter(fixed) {
						if (!attributeNode.spaces[key]) attributeNode.spaces[key] = {};

						// @ts-expect-error -- TS2532: Object is possibly 'undefined'.
						attributeNode.spaces[key].after = fixed;
					},
			  };

		if (primary === 'always') {
			setAfter(after.replace(/\s*$/, ' '));
		} else if (primary === 'never') {
			setAfter(after.replace(/\s*$/, ''));
		}
	}
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
