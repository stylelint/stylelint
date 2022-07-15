'use strict';

const valueParser = require('postcss-value-parser');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const findNotContiguousOrRectangular = require('./utils/findNotContiguousOrRectangular');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { assert } = require('../../utils/validateTypes');

const ruleName = 'named-grid-areas-no-invalid';

const messages = ruleMessages(ruleName, {
	expectedToken: () => 'Expected cell token within string',
	expectedSameNumber: () => 'Expected same number of cell tokens in each string',
	expectedRectangle: (name) => `Expected single filled-in rectangle for "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/named-grid-areas-no-invalid',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkDecls(/^(?:grid|grid-template|grid-template-areas)$/i, (decl) => {
			const { value } = decl;

			if (value.toLowerCase().trim() === 'none') return;

			/** @type {Array<{ values: string[], index: number, endIndex: number }>} */
			const areas = [];
			let reportSent = false;

			valueParser(value).walk(({ sourceIndex, sourceEndIndex, type, value: tokenValue }) => {
				if (type !== 'string') return;

				if (tokenValue === '') {
					complain(messages.expectedToken(), sourceIndex, sourceEndIndex);
					reportSent = true;

					return;
				}

				areas.push({
					values: tokenValue.trim().split(' ').filter(Boolean),
					index: sourceIndex,
					endIndex: sourceEndIndex,
				});
			});

			if (reportSent) return;

			const [firstArea] = areas;

			if (firstArea === undefined) return;

			const notSameNumberArea = areas.find(
				(area) => area.values.length !== firstArea.values.length,
			);

			if (notSameNumberArea !== undefined) {
				complain(
					messages.expectedSameNumber(),
					notSameNumberArea.index,
					notSameNumberArea.endIndex,
				);

				return;
			}

			const notContiguousOrRectangular = findNotContiguousOrRectangular(areas.map((a) => a.values));

			for (const name of notContiguousOrRectangular.sort()) {
				const area = areas.find((a) => a.values.includes(name));

				assert(area);
				complain(messages.expectedRectangle(name), area.index, area.endIndex);
			}

			/**
			 * @param {string} message
			 * @param {number} index
			 * @param {number} endIndex
			 */
			function complain(message, index, endIndex) {
				const start = declarationValueIndex(decl);

				report({
					message,
					node: decl,
					index: start + index,
					endIndex: start + endIndex,
					result,
					ruleName,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
