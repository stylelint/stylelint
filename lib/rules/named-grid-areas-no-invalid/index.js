// @ts-nocheck

'use strict';

const _ = require('lodash');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'named-grid-areas-no-invalid';

const messages = ruleMessages(ruleName, {
	noEmptyRows: () => 'empty row',
	noInvalidSymbols: (symbol) => `${symbol} is not a valid, only strings allowed`,
	notRectangular: () => 'template is not rectangular',
	notContiguousOrRectangular: (areaNames) =>
		`The following areas are not contiguous or rectangular ${areaNames.join(', ')}`,
});

function rule(actual) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual });

		if (!validOptions) {
			return;
		}

		root.walkDecls('grid-template-areas', (decl) => {
			const value = decl.value;
			const parsedValue = valueParser(value);

			if (
				parsedValue.nodes.length > 0 &&
				parsedValue.nodes[0].type === 'word' &&
				parsedValue.nodes[0].value === 'none'
			) {
				return;
			}

			let rows = [];

			parsedValue.walk((node) => {
				if (node.type !== 'string' && node.type !== 'space') {
					report({
						message: messages.noInvalidSymbols(node.value),
						node: decl,
						index: declarationValueIndex(decl) + node.sourceIndex,
						result,
						ruleName,
					});
				} else if (node.type === 'string' && node.value === '') {
					report({
						message: messages.noEmptyRows(node.value),
						node: decl,
						index: declarationValueIndex(decl) + node.sourceIndex,
						result,
						ruleName,
					});
				} else if (node.type === 'string' && node.value !== '') {
					rows.push(node);
				}
			});

			if (_.isEmpty(rows)) {
				return;
			}

			const areas = areasArray(rows);

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

function areasArray(rows) {
	return rows.map((row) => _.compact(row.value.trim().split(' ')));
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

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
