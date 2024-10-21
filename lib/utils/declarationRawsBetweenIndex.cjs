// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const validateTypes = require('./validateTypes.cjs');

/**
 * @param {import('postcss').Declaration} decl
 * @returns {number}
 */
function declarationRawsBetweenIndex(decl) {
	const raws = decl.raws;
	const prop = raws.prop;

	return [
		validateTypes.isObject(prop) && 'prefix' in prop && prop.prefix,
		(validateTypes.isObject(prop) && 'raw' in prop && prop.raw) || decl.prop,
		validateTypes.isObject(prop) && 'suffix' in prop && prop.suffix,
	].reduce((/** @type {number} */ count, str) => {
		if (validateTypes.isString(str)) {
			return count + str.length;
		}

		return count;
	}, 0);
}

module.exports = declarationRawsBetweenIndex;
