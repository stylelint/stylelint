// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'no-invalid-double-slash-comments';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected double-slash CSS comment',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-invalid-double-slash-comments',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			if (decl.prop.startsWith('//')) {
				report({
					message: messages.rejected,
					node: decl,
					result,
					ruleName,
				});
			}
		});

		root.walkRules((ruleNode) => {
			const selectors = (ruleNode.raws?.selector?.raw ?? ruleNode.selector).split(',');

			let ruleStringified;
			let index = 0;

			for (const value of selectors) {
				const selector = value.trimStart();

				if (selector.startsWith('//')) {
					const offset = value.length - selector.length;
					const i = index + offset;

					ruleStringified ??= ruleNode.toString();
					const lines = ruleStringified.slice(i).split('\n');
					let comment = lines[0] ?? '';

					if (lines.length > 1) comment += '\n';

					report({
						message: messages.rejected,
						node: ruleNode,
						result,
						ruleName,
						index: i,
						endIndex: i + comment.length,
					});
				}

				index += value.length + 1;
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
