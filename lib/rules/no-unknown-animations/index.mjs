import { animationNameKeywords } from '../../reference/keywords.mjs';
import { atRuleRegexes } from '../../utils/regexes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import findAnimationName from '../../utils/findAnimationName.mjs';
import memoizeForReferenceRoots from '../../utils/memoizeForReferenceRoots.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'no-unknown-animations';

const messages = ruleMessages(ruleName, {
	rejected: (animationName) => `Unknown animation "${animationName}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-unknown-animations',
};

/** @import {Root} from 'postcss' */

const getDeclaredAnimationsOfRoots = memoizeForReferenceRoots(getDeclaredAnimations);

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		const declaredAnimations = getDeclaredAnimationsOfRoots(root, result.stylelint.referenceRoots);

		/** @param {string} name */
		const isDeclared = (name) => declaredAnimations.some((declared) => declared.has(name));

		root.walkDecls((decl) => {
			if (decl.prop.toLowerCase() === 'animation' || decl.prop.toLowerCase() === 'animation-name') {
				const animationNames = findAnimationName(decl.value);

				if (animationNames.length === 0) {
					return;
				}

				for (const animationNameNode of animationNames) {
					if (animationNameKeywords.has(animationNameNode.value.toLowerCase())) {
						continue;
					}

					if (isDeclared(animationNameNode.value)) {
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

/**
 * @param {Root} rootNode
 * @returns {Set<string>}
 */
function getDeclaredAnimations(rootNode) {
	/** @type {Set<string>} */
	const declared = new Set();

	rootNode.walkAtRules(atRuleRegexes.keyframesName, (atRule) => {
		declared.add(atRule.params);
	});

	return declared;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
