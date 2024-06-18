import isAutoprefixable from '../../utils/isAutoprefixable.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'media-feature-name-no-vendor-prefix';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected vendor-prefix',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-name-no-vendor-prefix',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			const params = atRule.params;

			if (!isAutoprefixable.mediaFeatureName(params)) {
				return;
			}

			const features = [
				'-webkit-device-pixel-ratio',
				'-webkit-min-device-pixel-ratio',
				'-webkit-max-device-pixel-ratio',
				'-o-device-pixel-ratio',
				'-o-min-device-pixel-ratio',
				'-o-max-device-pixel-ratio',
				'-moz-device-pixel-ratio',
				'min--moz-device-pixel-ratio',
				'max--moz-device-pixel-ratio',
			].join('|');
			const matches = atRule.toString().match(new RegExp(`${features}`, 'gi'));

			if (!matches) {
				return;
			}

			for (const match of matches) {
				const fix = () => {
					const index = atRule.toString().indexOf(match);
					const re = /(-moz-|-o-|-webkit-)/i;
					const endIndex = index + match.replace(re, '').length;

					atRule.params = atRule.params.replace(re, '');

					return atRule.rangeBy({ index, endIndex });
				};

				report({
					message: messages.rejected,
					node: atRule,
					word: match,
					result,
					ruleName,
					fix,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
