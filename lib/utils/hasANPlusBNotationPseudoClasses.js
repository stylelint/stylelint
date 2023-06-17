'use strict';

const {
	aNPlusBNotationPseudoClasses,
	aNPlusBOfSNotationPseudoClasses,
} = require('../reference/selectors');

const classes = [
	...aNPlusBNotationPseudoClasses.values(),
	...aNPlusBOfSNotationPseudoClasses.values(),
].join('|');
const HAS_A_N_PLUS_B_NOTATION_PSEUDO_CLASSES = new RegExp(`\\b:(?:${classes})\\(`, 'i');

/**
 * Check if a selector contains any pseudo class function that might contain an An+B notation
 *
 * @param {string} selector
 * @returns {boolean}
 */
module.exports = function hasANPlusBNotationPseudoClasses(selector) {
	return HAS_A_N_PLUS_B_NOTATION_PSEUDO_CLASSES.test(selector);
};
