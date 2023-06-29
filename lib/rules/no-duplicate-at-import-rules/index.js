'use strict';

const getAtRuleParams = require('../../utils/getAtRuleParams');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'no-duplicate-at-import-rules';

const messages = ruleMessages(ruleName, {
	rejected: (atImport) => `Unexpected duplicate @import rule ${atImport}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-duplicate-at-import-rules',
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
			const [firstParam, ...restParams] = valueParser(getAtRuleParams(atRule)).nodes;

			if (!firstParam) {
				return;
			}

			// extract uri from url() if exists
			const uri =
				firstParam.type === 'function' && firstParam.value === 'url' && firstParam.nodes[0]
					? firstParam.nodes[0].value
					: firstParam.value;

			const media = listImportConditions(restParams);

			let importedUris = imports[uri];
			const isDuplicate = media.length
				? media.some((q) => importedUris && importedUris.includes(q))
				: importedUris;

			if (isDuplicate) {
				report({
					message: messages.rejected,
					messageArgs: [uri],
					node: atRule,
					result,
					ruleName,
					word: atRule.toString(),
				});

				return;
			}

			if (!importedUris) {
				importedUris = imports[uri] = [];
			}

			importedUris.push(...media);
		});
	};
};

/**
 * List the import conditions found in the prelude of an `@import` rule
 *
 * @param {Node[]} params
 * @typedef {import('postcss-value-parser').Node} Node
 * @returns {Array<string>}
 */
function listImportConditions(params) {
	if (!params.length) return [];

	/** @type {Array<String>} */
	let media = [];
	/** @type {Array<Node>} */
	let lastMediaQuery = [];

	for (const param of params) {
		// remove top level whitespace and comments to get a more consistent key
		if (param.type === 'space' || param.type === 'comment') {
			continue;
		}

		if (param.type === 'div' && param.value === ',') {
			media.push(valueParser.stringify(lastMediaQuery));
			lastMediaQuery = [];
			continue;
		}

		lastMediaQuery.push(param);
	}

	if (lastMediaQuery.length) {
		media.push(valueParser.stringify(lastMediaQuery));
	}

	// remove remaining whitespace to get a more consistent key
	return media.map((m) => m.replace(/\s/g, ''));
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
