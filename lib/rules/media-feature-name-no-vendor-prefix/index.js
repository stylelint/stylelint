'use strict';

const isAutoprefixable = require('../../utils/isAutoprefixable');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'media-feature-name-no-vendor-prefix';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected vendor-prefix',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/media-feature-name-no-vendor-prefix',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
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

			const matches = atRule.toString().match(/-[a-z-]+device-pixel-ratio/gi);

			if (!matches) {
				return;
			}

			if (context.fix) {
				atRule.params = isAutoprefixable.unprefix(atRule.params);

				return;
			}

			for (const match of matches) {
				report({
					message: messages.rejected,
					node: atRule,
					word: match,
					result,
					ruleName,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
