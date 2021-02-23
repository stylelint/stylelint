// @ts-nocheck

'use strict';

const _ = require('lodash');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');

const ruleName = 'named-grid-areas-no-invalid';

const messages = ruleMessages(ruleName, {
	noRows: () => 'no rows defined',
	notRectangular: () => 'template is not rectangular',
	notContiguousOrRectangular: (areaNames) =>
		`The following areas are not contiguous or rectangular ${areaNames.join(', ')}`,
});

function areasArray(gridTemplateString) {
	const regex = /["']([^"']*)["']/g;
	let captureGroups = [];
	let rows = [];
	let index = 0;

	while ((captureGroups = regex.exec(gridTemplateString)) !== null) {
		rows[index] = captureGroups[1];
		index++;
	}

	return rows.map((row) => _.compact(row.trim().split(' ')));
}

function columnsPerRow(areas) {
	return areas.map((row) => row.length);
}

function isRectangular(areas) {
	return columnsPerRow(areas).every((val, i, arr) => val === arr[0]);
}

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

function removeComment(value) {
	const regex = /\s*(?!<")\/\*[^*]+\*\/(?!")\s*/g;

	return value.replace(regex, '');
}

function rule() {
	return (root, result) => {
		root.walkDecls('grid-template-areas', (decl) => {
			const value = decl.value;

			if (value === 'none') {
				return;
			}

			const valueWithoutComment = removeComment(value);

			const areas = areasArray(valueWithoutComment);

			if (_.isEmpty(areas) || _.isEmpty(areas[0])) {
				report({
					message: messages.noRows(),
					node: decl,
					result,
					ruleName,
				});

				return;
			}

			if (!isRectangular(areas)) {
				report({
					message: messages.notRectangular(),
					node: decl,
					result,
					ruleName,
				});
			}

			const notContiguousOrRectangular = findNotContiguousOrRectangular(areas);

			if (!_.isEmpty(notContiguousOrRectangular)) {
				report({
					message: messages.notContiguousOrRectangular(notContiguousOrRectangular),
					node: decl,
					result,
					ruleName,
				});
			}
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
