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
 * @param {{ groupNegationArguments?: boolean }} [options]
 * @returns {Array<Array<NonSelector>>}
 */
export function groupByCompoundSelectors(selector, { groupNegationArguments = true } = {}) {
	const { terminatedCompoundSelectors, currentCompoundSelectors } =
		groupByCompoundSelectorsRecursive(selector, groupNegationArguments);

	return [...terminatedCompoundSelectors, ...currentCompoundSelectors].filter(
		(compound) => compound.length,
	);
}

/**
 * @param {Selector} selector
 * @param {boolean} groupNegationArguments
 * @returns {{ terminatedCompoundSelectors: Array<Array<NonSelector>>, currentCompoundSelectors: Array<Array<NonSelector>> }}
 */
function groupByCompoundSelectorsRecursive(selector, groupNegationArguments) {
	/** @type {Array<Array<NonSelector>>} */
	const terminatedCompoundSelectors = [];
	/** @type {Array<Array<NonSelector>>} */
	let currentCompoundSelectors = [[]];

	selector.each((node) => {
		if (selectorParser.isCombinator(node)) {
			terminatedCompoundSelectors.push(...currentCompoundSelectors);
			currentCompoundSelectors = [[]];

			return;
		}

		if (selectorParser.isPseudoElement(node)) {
			terminatedCompoundSelectors.push(...currentCompoundSelectors);
			currentCompoundSelectors = [[]];
		}

		if (
			selectorParser.isPseudoClass(node) &&
			node.value.toLowerCase() === ':has' &&
			Boolean(node.nodes.length)
		) {
			node.each((childSelector) => {
				const childCompounds = groupByCompoundSelectorsRecursive(
					childSelector,
					groupNegationArguments,
				);

				terminatedCompoundSelectors.push(
					...childCompounds.terminatedCompoundSelectors,
					...childCompounds.currentCompoundSelectors,
				);
			});

			return;
		}

		if (
			isSelectorContainingPseudoClass(node) &&
			(groupNegationArguments || node.value.toLowerCase() !== ':not')
		) {
			/** @type {Array<Array<NonSelector>>} */
			const compoundSelectorsCombinations = [];

			node.each((childSelector) => {
				const childCompounds = groupByCompoundSelectorsRecursive(
					childSelector,
					groupNegationArguments,
				);

				terminatedCompoundSelectors.push(...childCompounds.terminatedCompoundSelectors);

				childCompounds.currentCompoundSelectors.forEach((childCompound) => {
					if (!childCompound.length) return;

					currentCompoundSelectors.forEach((compoundSelector) => {
						compoundSelectorsCombinations.push([...compoundSelector, ...childCompound]);
					});
				});
			});

			if (compoundSelectorsCombinations.length) {
				currentCompoundSelectors = compoundSelectorsCombinations;
			}

			return;
		}

		currentCompoundSelectors.forEach((compoundSelector) => {
			compoundSelector.push(node);
		});
	});

	return {
		terminatedCompoundSelectors,
		currentCompoundSelectors,
	};
}
