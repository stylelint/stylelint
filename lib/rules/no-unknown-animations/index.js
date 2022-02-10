'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const findAnimationName = require('../../utils/findAnimationName');
const keywordSets = require('../../reference/keywordSets');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'no-unknown-animations';

const messages = ruleMessages(ruleName, {
	rejected: (animationName) => `Unexpected unknown animation name "${animationName}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/no-unknown-animations',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		const declaredAnimations = new Set();

		root.walkAtRules(/(-(moz|webkit)-)?keyframes/i, (atRule) => {
			declaredAnimations.add(atRule.params);
		});

		root.walkDecls((decl) => {
			if (decl.prop.toLowerCase() === 'animation' || decl.prop.toLowerCase() === 'animation-name') {
				const animationNames = findAnimationName(decl.value);

				if (animationNames.length === 0) {
					return;
				}

				for (const animationNameNode of animationNames) {
					if (keywordSets.animationNameKeywords.has(animationNameNode.value.toLowerCase())) {
						continue;
					}

					if (declaredAnimations.has(animationNameNode.value)) {
						continue;
					}

					report({
						result,
						ruleName,
						message: messages.rejected(animationNameNode.value),
						node: decl,
						index: declarationValueIndex(decl) + animationNameNode.sourceIndex,
					});
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
