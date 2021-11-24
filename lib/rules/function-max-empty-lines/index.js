'use strict';

const getDeclarationValue = require('../../utils/getDeclarationValue');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const setDeclarationValue = require('../../utils/setDeclarationValue');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');
const { isNumber } = require('../../utils/validateTypes');

const ruleName = 'function-max-empty-lines';

const messages = ruleMessages(ruleName, {
	expected: (max) => `Expected no more than ${max} empty ${max === 1 ? 'line' : 'lines'}`,
});

/**
 * @param {import('postcss').Declaration} decl
 */
function placeIndexOnValueStart(decl) {
	if (decl.raws.between == null) throw new Error('`between` must be present');

	return decl.prop.length + decl.raws.between.length - 1;
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	const maxAdjacentNewlines = primary + 1;

	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: isNumber,
		});

		if (!validOptions) {
			return;
		}

		const violatedNewLinesRegex = new RegExp(
			`(?:(\\r?\\n)[^\\S\\r\\n]*){${maxAdjacentNewlines + 1},}(?![^\\S\\r\\n]*\\S)`,
			'gm',
		);
		const allowedLFNewLinesString = context.fix ? '\n'.repeat(maxAdjacentNewlines) : '';
		const allowedCRLFNewLinesString = context.fix ? '\r\n'.repeat(maxAdjacentNewlines) : '';

		root.walkDecls((decl) => {
			if (!decl.value.includes('(')) {
				return;
			}

			const stringValue = getDeclarationValue(decl);
			/** @type {Array<[string, string]>} */
			const splittedValue = [];
			let sourceIndexStart = 0;

			valueParser(stringValue).walk((node) => {
				if (
					node.type !== 'function' /* ignore non functions */ ||
					node.value.length === 0 /* ignore sass lists */
				) {
					return;
				}

				const stringifiedNode = valueParser.stringify(node);

				const matches = [...stringifiedNode.matchAll(violatedNewLinesRegex)];

				if (matches.length === 0) {
					return;
				}

				if (context.fix) {
					const newNodeString = stringifiedNode.replace(violatedNewLinesRegex, (matchedString) => {
						return matchedString.startsWith('\r\n')
							? allowedCRLFNewLinesString
							: allowedLFNewLinesString;
					});

					splittedValue.push([
						stringValue.slice(sourceIndexStart, node.sourceIndex),
						newNodeString,
					]);
					sourceIndexStart = node.sourceIndex + stringifiedNode.length;
				} else {
					for (const match of matches) {
						const matchIndex = match.index === undefined ? 0 : match.index;

						const startIndex =
							placeIndexOnValueStart(decl) + node.sourceIndex + matchIndex + match[1].length + 1;

						report({
							message: messages.expected(primary),
							node: decl,
							index: startIndex,
							endIndex: startIndex + match[0].length - match[1].length + 1,
							result,
							ruleName,
						});
					}
				}
			});

			if (context.fix && splittedValue.length > 0) {
				const updatedValue =
					splittedValue.reduce((acc, curr) => acc + curr[0] + curr[1], '') +
					stringValue.slice(sourceIndexStart);

				setDeclarationValue(decl, updatedValue);
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
