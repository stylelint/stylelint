'use strict';

const arrayEqual = require('../../../utils/arrayEqual');

/**
 *
 * @param {string[][]} areas
 * @param {string} name
 * @returns {boolean}
 */
function isContiguousAndRectangular(areas, name) {
	const indicesByRow = areas.map((row) => {
		const indices = [];
		let idx = row.indexOf(name);

		while (idx !== -1) {
			indices.push(idx);
			idx = row.indexOf(name, idx + 1);
		}

		return indices;
	});

	for (let i = 0; i < indicesByRow.length; i++) {
		for (let j = i + 1; j < indicesByRow.length; j++) {
			const x = indicesByRow[i];
			const y = indicesByRow[j];

			if ((x && x.length === 0) || (y && y.length === 0)) {
				continue;
			}

			if (!arrayEqual(x, y)) {
				return false;
			}
		}
	}

	return true;
}

/**
 *
 * @param {string[][]} areas
 * @returns {string[]}
 */
function namedAreas(areas) {
	const names = new Set(areas.flat());

	names.delete('.');

	return [...names];
}

/**
 *
 * @param {string[][]} areas
 * @returns {string[]}
 */
function findNotContiguousOrRectangular(areas) {
	return namedAreas(areas).filter((name) => !isContiguousAndRectangular(areas, name));
}

module.exports = findNotContiguousOrRectangular;
