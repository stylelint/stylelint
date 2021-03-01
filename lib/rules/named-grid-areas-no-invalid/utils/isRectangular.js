'use strict';

function columnsPerRow(areas) {
	return areas.map((row) => row.length);
}

function isRectangular(areas) {
	return columnsPerRow(areas).every((val, i, arr) => val === arr[0]);
}

module.exports = isRectangular;
module.columnsPerRow = columnsPerRow;
