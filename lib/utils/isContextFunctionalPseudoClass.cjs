'use strict';

const selectors = require('../reference/selectors.cjs');

/**
 * Check whether a node is a context-functional pseudo-class (i.e. either a logical combination
 * or a 'aNPlusBOfSNotationPseudoClasses' / tree-structural pseudo-class)
 *
 * @param {import('postcss-selector-parser').Node} node - postcss-selector-parser node (of type pseudo)
 * @return {node is import('postcss-selector-parser').Pseudo} If `true`, the node is a context-functional pseudo-class
 */
function isContextFunctionalPseudoClass(node) {
	if (node.type === 'pseudo') {
		const normalisedParentName = node.value.toLowerCase().replace(/:+/, '');

		return (
			selectors.logicalCombinationsPseudoClasses.has(normalisedParentName) ||
			selectors.aNPlusBOfSNotationPseudoClasses.has(normalisedParentName)
		);
	}

	return false;
}

module.exports = isContextFunctionalPseudoClass;
