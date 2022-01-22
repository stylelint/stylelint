'use strict';

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'keyframe-declaration-no-important';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected !important',
});

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^(-(moz|webkit)-)?keyframes$/i, (atRuleKeyframes) => {
			atRuleKeyframes.walkDecls((decl) => {
				if (!decl.important) {
					return;
				}

				report({
					message: messages.rejected,
					node: decl,
					word: 'important',
					result,
					ruleName,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
