'use strict';

const mediaParser = require('postcss-media-query-parser').default;
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'no-duplicate-at-import-rules';

const messages = ruleMessages(ruleName, {
	rejected: (atImport) => `Unexpected duplicate @import rule ${atImport}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/no-duplicate-at-import-rules',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		/** @type {Record<string, string[]>} */
		const imports = {};

		root.walkAtRules(/^import$/i, (atRule) => {
			const [firstParam, ...restParams] = valueParser(atRule.params).nodes;

			if (!firstParam) {
				return;
			}

			// extract uri from url() if exists
			const uri =
				firstParam.type === 'function' && firstParam.value === 'url'
					? firstParam.nodes[0].value
					: firstParam.value;

			// extract media queries if any
			const media = (mediaParser(valueParser.stringify(restParams)).nodes || [])
				.map((n) => n.value.replace(/\s/g, ''))
				.filter((n) => n.length);

			const isDuplicate = media.length
				? imports[uri] && media.some((q) => imports[uri].includes(q))
				: imports[uri];

			if (isDuplicate) {
				report({
					message: messages.rejected(uri),
					node: atRule,
					result,
					ruleName,
				});

				return;
			}

			if (!imports[uri]) imports[uri] = [];

			imports[uri] = imports[uri].concat(media);
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
