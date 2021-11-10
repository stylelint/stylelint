'use strict';

/**
 * Check whether a hex color is standard
 *
 * @param {string} hex
 * @returns {boolean}
 */
module.exports = function isStandardSyntaxHexColor(property) {
	// Less map usage (e.g. .myclass { color: #colors[somecolor]; })
	if (property.includes('[')) {
		return false;
	}

	return true;
};
