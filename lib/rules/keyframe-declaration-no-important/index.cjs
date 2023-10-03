'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const getImportantPosition = require('../../utils/getImportantPosition.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'keyframe-declaration-no-important';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected !important',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/keyframe-declaration-no-important',
};

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

				const pos = getImportantPosition(decl.toString());

				validateTypes.assert(pos);

				report({
					message: messages.rejected,
					node: decl,
					index: pos.index,
					endIndex: pos.endIndex,
					result,
					ruleName,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;