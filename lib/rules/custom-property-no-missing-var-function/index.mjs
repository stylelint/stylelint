import valueParser from 'postcss-value-parser';

import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import isVarFunction from '../../utils/isVarFunction.mjs';
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

/** @typedef {import('postcss-value-parser').Node} Node */

// Properties that can receive a custom-ident
const IGNORED_PROPERTIES = new Set([
	'animation',
	'animation-name',
	'container-name',
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

			valueParser(value).nodes.forEach((childNode) => {
				check(childNode, decl);
			});
		});

		/**
		 * @param {Node} node
		 * @param {import('postcss').Declaration} decl
		 */
		function check(node, decl) {
			if (node.type === 'function') {
				const name = node.value.toLowerCase();

				let args = node.nodes;

				if (name === 'var') args = node.nodes.slice(1);
				else if (name === 'running') {
					const [child] = node.nodes;
					const mustDrill = child && isVarFunction(child);

					if (mustDrill) args = child.nodes.slice(1);
					else return;
				}

				args.forEach((arg) => check(arg, decl));

				return;
			}

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
		}
	};
};

/**
 * @param {Node} node
 */
function isDashedIdent({ type, value }) {
	return type === 'word' && value.startsWith('--');
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
