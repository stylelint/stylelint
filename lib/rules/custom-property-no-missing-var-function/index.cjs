// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const valueParser = require('postcss-value-parser');
const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const isVarFunction = require('../../utils/isVarFunction.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'custom-property-no-missing-var-function';

const messages = ruleMessages(ruleName, {
	rejected: (customProperty) => `Unexpected missing var function for "${customProperty}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/custom-property-no-missing-var-function',
};

// Properties that can receive a custom-ident
const IGNORED_PROPERTIES = new Set([
	'animation',
	'animation-name',
	'counter-increment',
	'counter-reset',
	'counter-set',
	'grid-column',
	'grid-column-end',
	'grid-column-start',
	'grid-row',
	'grid-row-end',
	'grid-row-start',
	'list-style',
	'list-style-type',
	'transition',
	'transition-property',
	'view-transition-name',
	'will-change',
]);

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		/** @type {Set<string>} */
		const knownCustomProperties = new Set();

		root.walkAtRules(/^property$/i, ({ params }) => {
			knownCustomProperties.add(params);
		});

		root.walkDecls(/^--/, ({ prop }) => {
			knownCustomProperties.add(prop);
		});

		root.walkDecls((decl) => {
			const { prop, value } = decl;

			if (!value.includes('--')) return;

			if (IGNORED_PROPERTIES.has(prop.toLowerCase())) return;

			valueParser(value).walk((node) => {
				if (isVarFunction(node)) return false;

				if (!isDashedIdent(node)) return;

				if (!knownCustomProperties.has(node.value)) return;

				const index = nodeFieldIndices.declarationValueIndex(decl) + node.sourceIndex;
				const endIndex = index + node.value.length;

				report({
					message: messages.rejected,
					messageArgs: [node.value],
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
				});

				return false;
			});
		});
	};
};

/**
 * @param {import('postcss-value-parser').Node} node
 */
function isDashedIdent({ type, value }) {
	return type === 'word' && value.startsWith('--');
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
