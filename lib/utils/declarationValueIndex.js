'use strict';

/**
 * Get the index of a declaration's value
 *
 * @param {import('postcss').Declaration} decl
 * @returns {number}
 */
module.exports = function declarationValueIndex(decl) {
	const raws = decl.raws;

	return [
		// @ts-expect-error -- TODO TYPES `prop` is missing
		raws.prop && raws.prop.prefix,
		// @ts-expect-error -- TODO TYPES `prop` is missing
		(raws.prop && raws.prop.raw) || decl.prop,
		// @ts-expect-error -- TODO TYPES `prop` is missing
		raws.prop && raws.prop.suffix,
		raws.between || ':',
		// @ts-expect-error -- TODO TYPES `prefix` is missing
		raws.value && raws.value.prefix,
	].reduce((count, str) => {
		if (str) {
			return count + str.length;
		}

		return count;
	}, 0);
};
