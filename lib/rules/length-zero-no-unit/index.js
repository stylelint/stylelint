// @ts-nocheck

'use strict';

const _ = require('lodash');
const beforeBlockString = require('../../utils/beforeBlockString');
const blurComments = require('../../utils/blurComments');
const hasBlock = require('../../utils/hasBlock');
const isCustomProperty = require('../../utils/isCustomProperty');
const isLessVariable = require('../../utils/isLessVariable');
const isMathFunction = require('../../utils/isMathFunction');
const keywordSets = require('../../reference/keywordSets');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const styleSearch = require('style-search');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');

const ruleName = 'length-zero-no-unit';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected unit',
});

function rule(actual, secondary, context) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual });

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			if (decl.prop.toLowerCase() === 'line-height') {
				return;
			}

			const stringValue = blurComments(decl.toString());
			const ignorableIndexes = new Array(stringValue.length).fill(false);
			const parsedValue = valueParser(stringValue);

			parsedValue.walk((node, nodeIndex, nodes) => {
				if (decl.prop.toLowerCase() === 'font' && node.type === 'div' && node.value === '/') {
					const lineHeightNode = nodes[nodeIndex + 1];
					const lineHeightNodeValue = valueParser.stringify(lineHeightNode);

					for (let i = 0; i < lineHeightNodeValue.length; i++) {
						ignorableIndexes[lineHeightNode.sourceIndex + i] = true;
					}

					return;
				}

				if (node.type !== 'function') {
					return;
				}

				// TODO: Issue #4985
				// eslint-disable-next-line no-shadow
				const stringValue = valueParser.stringify(node);
				const ignoreFlag = isMathFunction(node);

				for (let i = 0; i < stringValue.length; i++) {
					ignorableIndexes[node.sourceIndex + i] = ignoreFlag;
				}
			});

			check(stringValue, decl, ignorableIndexes);
		});

		root.walkAtRules((atRule) => {
			// Ignore Less variables
			if (isLessVariable(atRule)) {
				return;
			}

			const source = hasBlock(atRule)
				? beforeBlockString(atRule, { noRawBefore: true })
				: atRule.toString();

			check(source, atRule);
		});

		function check(value, node, ignorableIndexes = []) {
			if (optionsMatches(secondary, 'ignore', 'custom-properties') && isCustomProperty(value)) {
				return;
			}

			const fixPositions = [];

			styleSearch({ source: value, target: '0' }, (match) => {
				const index = match.startIndex;

				// Given a 0 somewhere in the full property value (not in a string, thanks
				// to styleSearch) we need to isolate the value that contains the zero.
				// To do so, we'll find the last index before the 0 of a character that would
				// divide one value in a list from another, and the next index of such a
				// character; then we build a substring from those indexes, which we can
				// assess.

				// If a single value includes multiple 0's (e.g. 100.01px), we don't want
				// each 0 to be treated as a separate value, possibly resulting in multiple
				// warnings for the same value (e.g. 0.00px).
				//
				// This check prevents that from happening: we build and check against a
				// Set containing all the indexes that are part of a value already validated.
				if (ignorableIndexes[index]) {
					return;
				}

				const prevValueBreakIndex = _.findLastIndex(value.substr(0, index), (char) => {
					return [' ', ',', ')', '(', '#', ':', '\n', '\t'].includes(char);
				});

				// Ignore hex colors
				if (value[prevValueBreakIndex] === '#') {
					return;
				}

				// If no prev break was found, this value starts at 0
				const valueWithZeroStart = prevValueBreakIndex === -1 ? 0 : prevValueBreakIndex + 1;

				const nextValueBreakIndex = _.findIndex(value.substr(valueWithZeroStart), (char) => {
					return [' ', ',', ')', '/'].includes(char);
				});

				// If no next break was found, this value ends at the end of the string
				const valueWithZeroEnd =
					nextValueBreakIndex === -1 ? value.length : nextValueBreakIndex + valueWithZeroStart;

				const valueWithZero = value.slice(valueWithZeroStart, valueWithZeroEnd);
				const parsedValue = valueParser.unit(valueWithZero);

				if (!parsedValue || (parsedValue && !parsedValue.unit)) {
					return;
				}

				if (parsedValue.unit.toLowerCase() === 'fr') {
					return;
				}

				// Add the indexes to ignorableIndexes so the same value will not
				// be checked multiple times.
				_.range(valueWithZeroStart, valueWithZeroEnd).forEach((i) => (ignorableIndexes[i] = true));

				// Only pay attention if the value parses to 0
				// and units with lengths
				if (
					parseFloat(valueWithZero) !== 0 ||
					!keywordSets.lengthUnits.has(parsedValue.unit.toLowerCase())
				) {
					return;
				}

				if (context.fix) {
					fixPositions.unshift({
						startIndex: valueWithZeroStart,
						length: valueWithZeroEnd - valueWithZeroStart,
					});

					return;
				}

				report({
					message: messages.rejected,
					node,
					index: valueWithZeroEnd - parsedValue.unit.length,
					result,
					ruleName,
				});
			});

			if (fixPositions.length) {
				fixPositions.forEach((fixPosition) => {
					if (node.type === 'atrule') {
						// Use `-1` for `@` character before each at rule
						const realIndex =
							fixPosition.startIndex - node.name.length - node.raws.afterName.length - 1;

						node.params = replaceZero(node.params, realIndex, fixPosition.length);
					} else {
						const realIndex = fixPosition.startIndex - node.prop.length - node.raws.between.length;

						node.value = replaceZero(node.value, realIndex, fixPosition.length);
					}
				});
			}
		}
	};
}

function replaceZero(input, startIndex, length) {
	const stringStart = input.slice(0, startIndex);
	const stringEnd = input.slice(startIndex + length);

	return `${stringStart}0${stringEnd}`;
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
