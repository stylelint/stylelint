'use strict';

/**
 *
 * @param {string[][]} areas
 * @returns {boolean}
 */
function isRectangular(areas) {
	return areas.every((row, _i, arr) => row.length === arr[0].length);
}

module.exports = isRectangular;
