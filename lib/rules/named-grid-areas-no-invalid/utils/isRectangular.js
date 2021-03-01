'use strict';

/**
 *
 * @param {string[][]} areas
 * @returns {boolean}
 */
function isRectangular(areas) {
	const columnsPerRow = areas.map((row) => row.length);

	return columnsPerRow.every((val, i, arr) => val === arr[0]);
}

module.exports = isRectangular;
