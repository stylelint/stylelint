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
	expectedToken: () => 'Expected cell token within string',
	expectedSameNumber: () => 'Expected same number of cell tokens in each string',
	expectedRectangle: (name) => `Expected single filled-in rectangle for "${name}"`,
});

function rule(actual) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual });

		if (!validOptions) {
			return;
		}

		root.walkDecls('grid-template-areas', (decl) => {
			function complain(message, sourceIndex = 0) {
				report({
					message,
					node: decl,
					index: declarationValueIndex(decl) + sourceIndex,
					result,
					ruleName,
				});
			}

			const value = decl.value;

			if (value.toLowerCase().trim() === 'none') return;

			const parsedValue = valueParser(value);

			let areas = [];
			let reportSent = false;

			parsedValue.walk((node) => {
				if (node.type === 'string' && node.value === '') {
					complain(messages.expectedToken(), node.sourceIndex);

					reportSent = true;
				} else if (node.type === 'string' && node.value !== '') {
					areas.push(_.compact(node.value.trim().split(' ')));
				}
			});

			if (reportSent) return;

			if (!isRectangular(areas)) {
				complain(messages.expectedSameNumber());

				return;
			}

			const notContiguousOrRectangular = findNotContiguousOrRectangular(areas);

			notContiguousOrRectangular.sort().forEach((name) => {
				complain(messages.expectedRectangle(name));
			});
		});
	};
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
