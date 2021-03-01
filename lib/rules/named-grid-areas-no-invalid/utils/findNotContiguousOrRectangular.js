'use strict';

const _ = require('lodash');

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
			if (indicesByRow[i].length === 0 || indicesByRow[j].length === 0) {
				continue;
			}

			if (!_.isEqual(indicesByRow[i], indicesByRow[j])) {
				return false;
			}
		}
	}

	return true;
}

function namedAreas(areas) {
	const names = new Set(_.flatten(areas));

	names.delete('.');

	return Array.from(names);
}

function findNotContiguousOrRectangular(areas) {
	return Array.from(
		new Set(namedAreas(areas).filter((name) => !isContiguousAndRectangular(areas, name))),
	);
}

module.exports = findNotContiguousOrRectangular;
module.namedAreas = namedAreas;
module.isContiguousAndRectangular;
