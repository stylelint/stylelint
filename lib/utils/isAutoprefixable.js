'use strict';

/**
 * Use Autoprefixer's secret powers to determine whether or
 * not a certain CSS identifier contains a vendor prefix that
 * Autoprefixer, given the standardized identifier, could add itself.
 *
 * Used by `*-no-vendor-prefix-*` rules to find superfluous
 * vendor prefixes.
 */

// NOTE: Lazy loading to avoid performance degrades.

/** @type {import('autoprefixer') | undefined} */
let autoprefixerCache;
const autoprefixer = () => {
	if (!autoprefixerCache) {
		autoprefixerCache = require('autoprefixer');
	}

	return autoprefixerCache;
};

/** @type {import('autoprefixer/lib/prefixes') | undefined} */
let prefixesCache;
const prefixes = () => {
	if (!prefixesCache) {
		const Browsers = require('autoprefixer/lib/browsers');
		const Prefixes = require('autoprefixer/lib/prefixes');

		const data = autoprefixer().data;

		prefixesCache = new Prefixes(data.prefixes, new Browsers(data.browsers, []));
	}

	return prefixesCache;
};

/**
 * Most identifier types have to be looked up in a unique way,
 * so we're exposing special functions for each.
 */
module.exports = {
	/**
	 * @param {string} identifier
	 * @returns {boolean}
	 */
	atRuleName(identifier) {
		return Boolean(prefixes().remove[`@${identifier.toLowerCase()}`]);
	},

	/**
	 * @param {string} identifier
	 * @returns {boolean}
	 */
	selector(identifier) {
		return prefixes().remove.selectors.some((/** @type {{ prefixed: string}} */ selectorObj) => {
			return identifier.toLowerCase() === selectorObj.prefixed;
		});
	},

	/**
	 * @param {string} identifier
	 * @returns {boolean}
	 */
	mediaFeatureName(identifier) {
		return identifier.toLowerCase().includes('device-pixel-ratio');
	},

	/**
	 * @param {string} identifier
	 * @returns {boolean}
	 */
	property(identifier) {
		return Boolean(autoprefixer().data.prefixes[prefixes().unprefixed(identifier.toLowerCase())]);
	},

	/**
	 *
	 * @param {string} prop
	 * @param {string} value
	 * @returns {boolean}
	 */
	propertyValue(prop, value) {
		const remove = prefixes().remove[prop.toLowerCase()];
		const possiblePrefixableValues = (remove && remove.values) || false;

		return (
			possiblePrefixableValues &&
			possiblePrefixableValues.some((/** @type {{ prefixed: string}} */ valueObj) => {
				return value.toLowerCase() === valueObj.prefixed;
			})
		);
	},

	/**
	 *
	 * @param {string} value
	 * @returns {string}
	 */
	unprefix(value) {
		return value.replace(/-\w+-/, '');
	},
};
