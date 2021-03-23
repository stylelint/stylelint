// @ts-nocheck

'use strict';

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'no-invalid-position-at-import-rule';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected invalid position @import rule',
});

function rule(actual) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual });

		if (!validOptions) {
			return;
		}

		let invalidPosition = false;

		root.walk((node) => {
			const nodeName = node.name && node.name.toLowerCase();

			if (node.type === 'comment' || (node.type === 'atrule' && nodeName === 'charset')) {
				return;
			}

			if (node.type === 'atrule' && nodeName === 'import') {
				if (invalidPosition) {
					report({
						message: messages.rejected,
						node,
						result,
						ruleName,
					});
				}

				return;
			}

			invalidPosition = true;
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
