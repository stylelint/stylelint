import valueParser from 'postcss-value-parser';

import declarationValueIndex from '../../utils/declarationValueIndex.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'custom-property-no-missing-var-function';

const messages = ruleMessages(ruleName, {
	rejected: (customProperty) => `Unexpected missing var function for "${customProperty}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/custom-property-no-missing-var-function',
};

const IGNORED_PROPERTIES = new Set([
	// In alphabetical order

	// Properties that can receive a custom-ident
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
	'will-change',
]);

/** @type {import('stylelint').Rule} */
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

				const index = declarationValueIndex(decl) + node.sourceIndex;
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

/**
 * @param {import('postcss-value-parser').Node} node
 */
function isVarFunction({ type, value }) {
	return type === 'function' && value === 'var';
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
