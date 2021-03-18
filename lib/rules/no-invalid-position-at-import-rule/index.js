// @ts-nocheck

'use strict';

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'no-invalid-position-at-import-rule';

const messages = ruleMessages(ruleName, {
	rejected: (atImport) => `Unexpected invalid position @import rule ${atImport}`,
});

function rule(actual) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual });

		if (!validOptions) {
			return;
		}

		let invalidPosition = false;

		root.walk((node) => {
			if (node.type === 'comment' || (node.type === 'atrule' && /^charset$/i.test(node.name))) {
				return;
			}

			if (node.type === 'atrule' && /^import$/i.test(node.name)) {
				if (invalidPosition) {
					const url = getAtImportUrl(node);

					if (url) {
						report({
							message: messages.rejected(url),
							node,
							result,
							ruleName,
						});
					}
				}

				return;
			}

			invalidPosition = true;
		});
	};
}

function getAtImportUrl(node) {
	const params = valueParser(node.params).nodes;

	if (!params.length) {
		return null;
	}

	return params[0].type === 'function' && /^url$/i.test(params[0].value)
		? params[0].nodes[0].value
		: params[0].value;
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
