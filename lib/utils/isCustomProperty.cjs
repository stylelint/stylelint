'use strict';

/**
 * Check whether a property is a custom one
 * @param {string} property
 * @returns {boolean}
 */
function isCustomProperty(property) {
	return property.startsWith('--');
}

module.exports = isCustomProperty;
