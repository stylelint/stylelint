import { hyphenContainingTypeSelectors } from '../reference/selectors.mjs';

/**
 * Check whether a type selector is a custom element
 *
 * @see https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
 * @param {string} selector
 * @returns {boolean}
 */
export default function isCustomElement(selector) {
	if (!/^[a-z]/.test(selector)) {
		return false;
	}

	if (!selector.includes('-')) {
		return false;
	}

	if (selector.toLowerCase() !== selector) {
		return false;
	}

	return !hyphenContainingTypeSelectors.has(selector);
}
