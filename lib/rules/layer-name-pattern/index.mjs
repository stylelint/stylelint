import { atRuleRegexes, functionRegexes } from '../../utils/regexes.mjs';
import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { atRuleParamIndex } from '../../utils/nodeFieldIndices.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'layer-name-pattern';

const messages = ruleMessages(ruleName, {
	expected: (name, pattern) => `Expected "${name}" to match pattern "${pattern}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/layer-name-pattern',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isRegExp, isString],
		});

		if (!validOptions) return;

		const pattern = isString(primary) ? new RegExp(primary) : primary;

		root.walkAtRules(atRuleRegexes.layer, (atRule) => {
			if (!atRule.params) return;

			const layerNames = atRule.params.split(',').map((s) => s.trim());
			const baseIndex = atRuleParamIndex(atRule);
			let startIndex = 0;

			layerNames.forEach((layerName) => {
				const segments = layerName.split('.');

				segments.forEach((segment) => {
					if (pattern.test(segment)) return;

					const segmentStart = atRule.params.indexOf(segment, startIndex);

					const index = baseIndex + segmentStart;
					const endIndex = index + segment.length;

					report({
						message: messages.expected(segment, primary),
						node: atRule,
						index,
						endIndex,
						ruleName,
						result,
					});
				});

				// Added +1 because the next layer name starts with a comma
				startIndex = atRule.params.indexOf(layerName) + layerName.length + 1;
			});
		});

		root.walkAtRules(atRuleRegexes.importName, (atRule) => {
			const layerMatch = atRule.params.match(functionRegexes.layer);

			if (!layerMatch || !layerMatch[1] || !layerMatch.index) return;

			const layerContent = layerMatch[1];
			const layerNames = layerContent.split(',').map((s) => s.trim());
			const baseIndex = atRuleParamIndex(atRule);

			// `+ 6` because the layer name starts with `layer(`
			const layerStart = layerMatch.index + 6;
			let startIndex = layerStart;

			layerNames.forEach((layerName) => {
				const segments = layerName.split('.');

				segments.forEach((segment) => {
					if (pattern.test(segment)) return;

					// minus `layerStart` because the segment starts after the layer name
					const segmentStart = layerContent.indexOf(segment, startIndex - layerStart);
					const index = baseIndex + layerStart + segmentStart;
					const endIndex = index + segment.length;

					report({
						message: messages.expected(segment, primary),
						node: atRule,
						index,
						endIndex,
						ruleName,
						result,
					});
				});

				// Added 1 because the next layer name starts with a comma
				startIndex = layerStart + layerContent.indexOf(layerName) + layerName.length + 1;
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
