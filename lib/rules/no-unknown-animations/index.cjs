'use strict';

const keywords = require('../../reference/keywords.cjs');
const declarationValueIndex = require('../../utils/declarationValueIndex.cjs');
const findAnimationName = require('../../utils/findAnimationName.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'no-unknown-animations';

const messages = ruleMessages(ruleName, {
	rejected: (animationName) => `Unexpected unknown animation name "${animationName}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-unknown-animations',
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
					if (keywords.animationNameKeywords.has(animationNameNode.value.toLowerCase())) {
						continue;
					}

					if (declaredAnimations.has(animationNameNode.value)) {
						continue;
					}

					const begin = declarationValueIndex(decl);

					report({
						result,
						ruleName,
						message: messages.rejected,
						messageArgs: [animationNameNode.value],
						node: decl,
						index: begin + animationNameNode.sourceIndex,
						endIndex: begin + animationNameNode.sourceEndIndex,
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