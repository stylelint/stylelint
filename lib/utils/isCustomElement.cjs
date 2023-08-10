'use strict';

const mathMLTags = require('mathml-tag-names');
const svgTags = require('svg-tags');
const selectors = require('../reference/selectors.cjs');

/**
 * Check whether a type selector is a custom element
 *
 * @param {string} selector
 * @returns {boolean}
 */
function isCustomElement(selector) {
	if (!/^[a-z]/.test(selector)) {
		return false;
	}

	if (!selector.includes('-')) {
		return false;
	}

	const selectorLowerCase = selector.toLowerCase();

	if (selectorLowerCase !== selector) {
		return false;
	}

	if (svgTags.includes(selectorLowerCase)) {
		return false;
	}

	if (selectors.htmlTypeSelectors.has(selectorLowerCase)) {
		return false;
	}

	if (mathMLTags.includes(selectorLowerCase)) {
		return false;
	}

	return true;
}

module.exports = isCustomElement;
