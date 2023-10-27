// NOTICE: This file is generated by Rollup. If you want to change,
// please edit its ESM version file instead of this one.
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
