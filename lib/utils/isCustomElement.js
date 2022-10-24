'use strict';

const { htmlTypeSelectors } = require('../reference/selectors');
const mathMLTags = require('mathml-tag-names');
const svgTags = require('svg-tags');

/**
 * Check whether a type selector is a custom element
 *
 * @param {string} selector
 * @returns {boolean}
 */
module.exports = function isCustomElement(selector) {
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

	if (htmlTypeSelectors.has(selectorLowerCase)) {
		return false;
	}

	if (mathMLTags.includes(selectorLowerCase)) {
		return false;
	}

	return true;
};
