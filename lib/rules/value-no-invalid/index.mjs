import { ParseErrorMessage, calcFromComponentValues } from '@csstools/css-calc';
import {
	isFunctionNode,
	parseListOfComponentValues,
	sourceIndices,
	walk,
} from '@csstools/css-parser-algorithms';
import { parse } from 'css-tree';
import { tokenize } from '@csstools/css-tokenizer';

import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import formatReason from '../../utils/formatReason.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import getSyntaxErrorPosition from '../../utils/getSyntaxErrorPosition.mjs';
import isCustomFunction from '../../utils/isCustomFunction.mjs';
import isCustomProperty from '../../utils/isCustomProperty.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import isStandardSyntaxProperty from '../../utils/isStandardSyntaxProperty.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import { mayIncludeRegexes } from '../../utils/regexes.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'value-no-invalid';

const messages = ruleMessages(ruleName, {
	rejected: (value, reason) => `Invalid value "${value}"${reason ? `, ${reason}` : ''}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/value-no-invalid',
};

/**
 * Functions whose arguments csstree cannot parse, alongside custom functions
 * see https://github.com/stylelint/stylelint/issues/8779
 */
const UNPARSABLE_FUNCTIONS_IN_CSSTREE = new Set(['attr', 'if']);

/**
 * Reasons for the css-calc parse errors, each of which covers both operand orders
 * see https://drafts.csswg.org/css-values/#calc-type-checking
 */
const reasonsByParseErrorMessage = new Map([
	[
		ParseErrorMessage.UnexpectedAdditionOfDimensionOrPercentageWithNumber,
		'a number and a dimension or percentage cannot be added',
	],
	[
		ParseErrorMessage.UnexpectedSubtractionOfDimensionOrPercentageWithNumber,
		'a number and a dimension or percentage cannot be subtracted',
	],
]);

/**
 * @typedef {(index: number, endIndex: number, subject: string, reason: string) => void} Complain
 */

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		root.walkDecls((decl) => {
			if (!isStandardSyntaxDeclaration(decl)) return;

			const { prop } = decl;

			if (!isStandardSyntaxProperty(prop)) return;

			const value = getDeclarationValue(decl);

			if (!isStandardSyntaxValue(value)) return;

			/** @type {Complain} */
			const complain = (index, endIndex, subject, reason) => {
				const valueIndex = declarationValueIndex(decl);

				report({
					message: messages.rejected,
					messageArgs: [subject, reason],
					node: decl,
					index: valueIndex + index,
					endIndex: valueIndex + endIndex,
					ruleName,
					result,
				});
			};

			checkMathFunctions(value, complain);

			// Custom property values are `<declaration-value>`s, which csstree cannot parse
			if (isCustomProperty(prop)) return;

			checkSyntax(value, complain);
		});
	};
};

/**
 * Math expressions that add or subtract a number to a dimension or percentage are invalid
 * see https://drafts.csswg.org/css-values/#calc-type-checking
 *
 * @param {string} value
 * @param {Complain} complain
 * @returns {void}
 */
function checkMathFunctions(value, complain) {
	if (!mayIncludeRegexes.mathFunction.test(value)) return;

	/** @type {import('@csstools/css-calc').ParseError | undefined} */
	let parseError;

	calcFromComponentValues([parseListOfComponentValues(tokenize({ css: value }))], {
		// Keep the first error, as css-calc reports it again at each enclosing math function
		onParseError: (error) => {
			parseError ??= error;
		},
	});

	if (!parseError) return;

	const { message, sourceStart, sourceEnd } = parseError;
	const endIndex = sourceEnd + 1;
	const reason = reasonsByParseErrorMessage.get(message) ?? formatReason(message);

	complain(sourceStart, endIndex, value.slice(sourceStart, endIndex), reason);
}

/**
 * Values that csstree cannot parse are invalid, unless the error lies within a function
 * whose arguments it cannot parse
 *
 * @param {string} value
 * @param {Complain} complain
 * @returns {void}
 */
function checkSyntax(value, complain) {
	try {
		parse(value, { context: 'value' });
	} catch (error) {
		if (!(error instanceof SyntaxError)) throw error;

		const { index, endIndex } = getSyntaxErrorPosition(error, value);

		if (isWithinUnparsableFunction(value, index)) return;

		complain(index, endIndex, value, formatReason(error.message));
	}
}

/**
 * @param {string} value
 * @param {number} offset
 * @returns {boolean}
 */
function isWithinUnparsableFunction(value, offset) {
	let within = false;

	walk(parseListOfComponentValues(tokenize({ css: value })), ({ node }) => {
		if (!isFunctionNode(node) || !isUnparsableFunction(node.getName())) return;

		const [start, end] = sourceIndices(node);

		if (start <= offset && offset <= end) {
			within = true;

			return false;
		}
	});

	return within;
}

/**
 * @param {string} name
 * @returns {boolean}
 */
function isUnparsableFunction(name) {
	return isCustomFunction(name) || UNPARSABLE_FUNCTIONS_IN_CSSTREE.has(name.toLowerCase());
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
