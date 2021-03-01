'use strict';

/**
 *
 * @param {string[][]} areas
 * @returns {number[]}
 */
function columnsPerRow(areas) {
	return areas.map((row) => row.length);
}

/**
 *
 * @param {string[][]} areas
 * @returns {boolean}
 */
function isRectangular(areas) {
	return columnsPerRow(areas).every((val, i, arr) => val === arr[0]);
}

module.exports = isRectangular;
