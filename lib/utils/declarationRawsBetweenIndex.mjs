import { isObject, isString } from './validateTypes.mjs';

/**
 * @param {import('postcss').Declaration} decl
 * @returns {number}
 */
export default function declarationRawsBetweenIndex(decl) {
	const raws = decl.raws;
	const prop = raws.prop;

	return [
		isObject(prop) && 'prefix' in prop && prop.prefix,
		(isObject(prop) && 'raw' in prop && prop.raw) || decl.prop,
		isObject(prop) && 'suffix' in prop && prop.suffix,
	].reduce((/** @type {number} */ count, str) => {
		if (isString(str)) {
			return count + str.length;
		}

		return count;
	}, 0);
}
