import selectorParser from 'postcss-selector-parser';

import isSelectorContainingPseudoClass from './isSelectorContainingPseudoClass.mjs';

/** @import { Tag, Node, Selector, Root } from 'postcss-selector-parser' */

/**
 * @typedef {Exclude<Node, Selector>} NonSelector
 */

/**
 * @param {Root} root
 * @returns {{compoundSelectors: Root, lookupMap: Map<Tag, Tag>}}
 */
export default function getCompoundSelectors(root) {
	const compoundSelectors = selectorParser.root({
		source: root.source,
		sourceIndex: root.sourceIndex,
		value: '',
		nodes: [],
	});

	/** @type {Map<Tag, Tag>} */
	const lookupMap = new Map();

	root.each((selector) => {
		groupByCompoundSelectors(selector).forEach((compoundSelector) => {
			const selectorClone = selector.clone({
				nodes: [],
			});

			compoundSelector.forEach((node) => {
				const clone = node.clone();

				if (selectorParser.isTag(node)) {
					lookupMap.set(/** @type {typeof node} */ (clone), node);
				}

				selectorClone.append(clone);
			});

			compoundSelectors.append(selectorClone);
		});
	});

	return {
		compoundSelectors,
		lookupMap,
	};
}

/**
 * @param {Selector} selector
 * @returns {Array<Array<NonSelector>>}
 */
export function groupByCompoundSelectors(selector) {
	/** @type {Array<Array<NonSelector>>} */
	const compoundSelectors = [];
	/** @type {Array<Array<NonSelector>>} */
	let currentCompoundSelectors = [[]];

	selector.each((node) => {
		if (selectorParser.isCombinator(node)) {
			compoundSelectors.push(...currentCompoundSelectors);
			currentCompoundSelectors = [[]];

			return;
		}

		if (selectorParser.isPseudoElement(node)) {
			compoundSelectors.push(...currentCompoundSelectors);
			currentCompoundSelectors = [[]];
		}

		if (isHasPseudoClass(node)) {
			const hasPseudo = /** @type {selectorParser.Pseudo} */ (node);

			// Add :has() to the outer compound without merging inner selectors
			currentCompoundSelectors.forEach((compoundSelector) => {
				compoundSelector.push(hasPseudo);
			});

			// Evaluate inner selectors independently
			hasPseudo.each((childSelector) => {
				compoundSelectors.push(...groupByCompoundSelectors(childSelector));
			});

			return;
		}

		if (isSelectorContainingPseudoClass(node)) {
			/** @type {Array<Array<NonSelector>>} */
			const compoundSelectorsCombinations = [];

			node.each((childSelector) => {
				const childCompounds = groupByCompoundSelectors(childSelector);

				const rightMost = childCompounds.at(-1);

				if (!rightMost) return;

				const remainder = childCompounds.slice(0, -1);

				compoundSelectors.push(...remainder);

				currentCompoundSelectors.forEach((compoundSelector) => {
					compoundSelectorsCombinations.push([...compoundSelector, ...rightMost]);
				});
			});

			currentCompoundSelectors = compoundSelectorsCombinations;

			return;
		}

		currentCompoundSelectors.forEach((compoundSelector) => {
			compoundSelector.push(node);
		});
	});

	if (currentCompoundSelectors.length) {
		compoundSelectors.push(...currentCompoundSelectors);
	}

	return compoundSelectors;
}

/**
 * @param {unknown} node
 * @returns {boolean}
 */
function isHasPseudoClass(node) {
	return selectorParser.isPseudoClass(node) && node.value === ':has' && Boolean(node.nodes.length);
}
