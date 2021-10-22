'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const findNotContiguousOrRectangular = require('./utils/findNotContiguousOrRectangular');
const isRectangular = require('./utils/isRectangular');
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

			/** @type {string[][]} */
			const areas = [];
			let reportSent = false;

			valueParser(value).walk(({ sourceIndex, type, value: tokenValue }) => {
				if (type !== 'string') return;

				if (tokenValue === '') {
					complain(messages.expectedToken(), sourceIndex);
					reportSent = true;

					return;
				}

				areas.push(
					tokenValue
						.trim()
						.split(' ')
						.filter((s) => s.length > 0),
				);
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

			/**
			 * @param {string} message
			 * @param {number} [sourceIndex=0]
			 */
			function complain(message, sourceIndex = 0) {
				report({
					message,
					node: decl,
					index: declarationValueIndex(decl) + sourceIndex,
					result,
					ruleName,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
