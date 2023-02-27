'use strict';

const { isObject, isString } = require('./validateTypes');

/**
 * Get the index of a declaration's value
 *
 * @param {import('postcss').Declaration} decl
 * @returns {number}
 */
module.exports = function declarationValueIndex(decl) {
	const raws = decl.raws;
	const prop = raws.prop;

	return [
		isObject(prop) && 'prefix' in prop && prop.prefix,
		(isObject(prop) && 'raw' in prop && prop.raw) || decl.prop,
		isObject(prop) && 'suffix' in prop && prop.suffix,
		raws.between || ':',
		raws.value && 'prefix' in raws.value && raws.value.prefix,
	].reduce((/** @type {number} */ count, str) => {
		if (isString(str)) {
			return count + str.length;
		}

		return count;
	}, 0);
};
