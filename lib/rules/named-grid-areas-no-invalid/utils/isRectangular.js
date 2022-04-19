'use strict';

/**
 *
 * @param {string[][]} areas
 * @returns {boolean}
 */
function isRectangular(areas) {
	const firstArea = areas[0];

	if (firstArea === undefined) return false;

	return areas.every((row) => row.length === firstArea.length);
}

module.exports = isRectangular;
