// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const selectors = require('../reference/selectors.cjs');

const classes = [
	...selectors.aNPlusBNotationPseudoClasses.values(),
	...selectors.aNPlusBOfSNotationPseudoClasses.values(),
].join('|');
const HAS_A_N_PLUS_B_NOTATION_PSEUDO_CLASSES = new RegExp(`\\b:(?:${classes})\\(`, 'i');

/**
 * Check if a selector contains any pseudo class function that might contain an An+B notation
 *
 * @param {string} selector
 * @returns {boolean}
 */
function hasANPlusBNotationPseudoClasses(selector) {
	return HAS_A_N_PLUS_B_NOTATION_PSEUDO_CLASSES.test(selector);
}

module.exports = hasANPlusBNotationPseudoClasses;
