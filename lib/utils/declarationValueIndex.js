'use strict';

/**
 * Get the index of a declaration's value
 *
 * @param {import('postcss').Declaration} decl
 *
 * @returns {number}
 */
module.exports = function (decl) {
	// Casting this to any because 'prop' and 'value' do not exist on type 'NodeRaws'
	/** @type {any} */
	const raws = decl.raws;

	return [
		raws.prop && raws.prop.prefix,
		(raws.prop && raws.prop.raw) || decl.prop,
		raws.prop && raws.prop.suffix,
		raws.between || ':',
		raws.value && raws.value.prefix,
	].reduce((count, str) => {
		if (str) {
			return count + str.length;
		}

		return count;
	}, 0);
};
