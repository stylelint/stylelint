/* @flow */
'use strict';

const autoprefixer = require('autoprefixer');
const Browsers = require('autoprefixer/lib/browsers');
const Prefixes = require('autoprefixer/lib/prefixes');

/**
 * Use Autoprefixer's secret powers to determine whether or
 * not a certain CSS identifier contains a vendor prefix that
 * Autoprefixer, given the standardized identifier, could add itself.
 *
 * Used by `*-no-vendor-prefix-*` rules to find superfluous
 * vendor prefixes.
 */

const prefixes = new Prefixes(
	autoprefixer.data.prefixes,
	new Browsers(autoprefixer.data.browsers, []),
);

/**
 * Most identifier types have to be looked up in a unique way,
 * so we're exposing special functions for each.
 */
module.exports = {
	/**
	 * @param {string} identifier
	 * @returns {boolean}
	 */
	atRuleName(identifier /*: string*/) /*: boolean*/ {
		return !!prefixes.remove[`@${identifier.toLowerCase()}`];
	},

	/**
	 * @param {string} identifier
	 * @returns {boolean}
	 */
	selector(identifier /*: string*/) /*: boolean*/ {
		return prefixes.remove.selectors.some((/** @type {{ prefixed: string}} */ selectorObj) => {
			return identifier.toLowerCase() === selectorObj.prefixed;
		});
	},

	/**
	 * @param {string} identifier
	 * @returns {boolean}
	 */
	mediaFeatureName(identifier /*: string*/) /*: boolean*/ {
		return identifier.toLowerCase().indexOf('device-pixel-ratio') !== -1;
	},

	/**
	 * @param {string} identifier
	 * @returns {boolean}
	 */
	property(identifier /*: string*/) /*: boolean*/ {
		return !!autoprefixer.data.prefixes[prefixes.unprefixed(identifier.toLowerCase())];
	},

	/**
	 *
	 * @param {string} prop
	 * @param {string} value
	 * @returns {boolean}
	 */
	propertyValue(prop /*: string*/, value /*: string*/) /*: boolean*/ {
		const possiblePrefixableValues =
			(prefixes.remove[prop.toLowerCase()] && prefixes.remove[prop.toLowerCase()].values) || false;

		return (
			possiblePrefixableValues &&
			possiblePrefixableValues.some((/** @type {{ prefixed: string}} */ valueObj) => {
				return value.toLowerCase() === valueObj.prefixed;
			})
		);
	},
};
