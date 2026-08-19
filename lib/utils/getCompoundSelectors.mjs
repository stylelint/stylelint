import selectorParser from 'postcss-selector-parser';

import isSelectorContainingPseudoClass from './isSelectorContainingPseudoClass.mjs';

/** @import { Tag, Node, Pseudo, Selector, Root } from 'postcss-selector-parser' */

/**
 * @typedef {Exclude<Node, Selector>} NonSelector
 * @typedef {(node: unknown) => node is Pseudo} FlattenablePseudoPredicate
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
 * Group a selector's nodes into flattened compound selectors. The arguments of
 * `:has()` are always split off into separate compound selectors, regardless of
 * the predicate.
 *
 * @param {Selector} selector
 * @param {FlattenablePseudoPredicate} [isFlattenablePseudo]
 * @returns {Array<Array<NonSelector>>}
 */
export function groupByCompoundSelectors(
	selector,
	isFlattenablePseudo = isSelectorContainingPseudoClass,
) {
	const { terminatedCompoundSelectors, currentCompoundSelectors } =
		groupByCompoundSelectorsRecursive(selector, isFlattenablePseudo);

	return [...terminatedCompoundSelectors, ...currentCompoundSelectors].filter(
		(compound) => compound.length,
	);
}

/**
 * @param {Selector} selector
 * @param {FlattenablePseudoPredicate} isFlattenablePseudo
 * @returns {{ terminatedCompoundSelectors: Array<Array<NonSelector>>, currentCompoundSelectors: Array<Array<NonSelector>> }}
 */
function groupByCompoundSelectorsRecursive(selector, isFlattenablePseudo) {
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
					isFlattenablePseudo,
				);

				terminatedCompoundSelectors.push(
					...childCompounds.terminatedCompoundSelectors,
					...childCompounds.currentCompoundSelectors,
				);
			});

			return;
		}

		if (isFlattenablePseudo(node)) {
			/** @type {Array<Array<NonSelector>>} */
			const compoundSelectorsCombinations = [];

			node.each((childSelector) => {
				const childCompounds = groupByCompoundSelectorsRecursive(
					childSelector,
					isFlattenablePseudo,
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
