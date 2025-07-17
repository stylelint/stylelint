import selectorParser from 'postcss-selector-parser';
import valueParser from 'postcss-value-parser';

const { isAttribute, isComment } = selectorParser;

import {
	atRuleAfterIndex,
	atRuleAfterNameIndex,
	atRuleBetweenIndex,
	atRuleParamIndex,
	declarationBetweenIndex,
	declarationValueIndex,
	ruleAfterIndex,
	ruleBetweenIndex,
} from '../../utils/nodeFieldIndices.mjs';

import getAtRuleParams from '../../utils/getAtRuleParams.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'no-irregular-whitespace';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected irregular whitespace',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-irregular-whitespace',
};

const IRREGULAR_WHITESPACES = [
	'\u000B', // Line Tabulation (\v) - <VT>
	'\u000C', // Form Feed (\f) - <FF>
	'\u00A0', // No-Break Space - <NBSP>
	'\u0085', // Next Line
	'\u1680', // Ogham Space Mark
	'\u180E', // Mongolian Vowel Separator - <MVS>
	'\uFEFF', // Zero Width No-Break Space - <BOM>
	'\u2000', // En Quad
	'\u2001', // Em Quad
	'\u2002', // En Space - <ENSP>
	'\u2003', // Em Space - <EMSP>
	'\u2004', // Tree-Per-Em
	'\u2005', // Four-Per-Em
	'\u2006', // Six-Per-Em
	'\u2007', // Figure Space
	'\u2008', // Punctuation Space - <PUNCSP>
	'\u2009', // Thin Space
	'\u200A', // Hair Space
	'\u200B', // Zero Width Space - <ZWSP>
	'\u2028', // Line Separator
	'\u2029', // Paragraph Separator
	'\u202F', // Narrow No-Break Space
	'\u205F', // Medium Mathematical Space
	'\u3000', // Ideographic Space
];

const irregularWhitespacesChars = IRREGULAR_WHITESPACES.join('');

const IRREGULAR_WHITESPACE_PATTERN = new RegExp(`[${irregularWhitespacesChars}]`);
const IRREGULAR_WHITESPACES_PATTERN = new RegExp(`[${irregularWhitespacesChars}]+`, 'g');

/**
 * @param {string} str
 * @returns {Array<{index: number, length: number}>}
 */
const findIrregularWhitespace = (str) => {
	return Array.from(str.matchAll(IRREGULAR_WHITESPACES_PATTERN)).map((match) => {
		return {
			index: match.index,
			length: match[0].length,
		};
	});
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		/**
		 * @template {import('postcss').Node} T
		 * @param {T} node
		 * @param {string | undefined} value
		 * @param {(node: T) => number} getIndex
		 * @param {((value: string) => string)=} normalizeQuoted
		 */
		const validate = (node, value, getIndex, normalizeQuoted) => {
			if (!value) return;

			if (normalizeQuoted && IRREGULAR_WHITESPACE_PATTERN.test(value)) {
				value = normalizeQuoted(value);
			}

			const issues = findIrregularWhitespace(value);

			if (!issues.length) return;

			const startIndex = getIndex(node);

			issues.forEach(({ index, length }) => {
				report({
					ruleName,
					result,
					message: messages.rejected,
					messageArgs: [],
					node,
					index: startIndex + index,
					endIndex: startIndex + index + length,
				});
			});
		};

		root.walkAtRules((atRule) => {
			validate(atRule, atRule.raws.before, zeroIndex);
			validate(atRule, atRule.name, oneIndex);
			validate(atRule, atRule.raws.afterName, atRuleAfterNameIndex);
			validate(atRule, getAtRuleParams(atRule), atRuleParamIndex, normalizeQuotedInValue);
			validate(atRule, atRule.raws.between, atRuleBetweenIndex);
			validate(atRule, atRule.raws.after, atRuleAfterIndex);
		});

		root.walkRules((ruleNode) => {
			validate(ruleNode, ruleNode.raws.before, zeroIndex);
			validate(ruleNode, getRuleSelector(ruleNode), zeroIndex, normalizeQuotedInSelector);
			validate(ruleNode, ruleNode.raws.between, ruleBetweenIndex);
			validate(ruleNode, ruleNode.raws.after, ruleAfterIndex);
		});

		root.walkDecls((decl) => {
			validate(decl, decl.raws.before, zeroIndex);
			validate(decl, decl.prop, zeroIndex, normalizeQuotedInValue);
			validate(decl, decl.raws.between, declarationBetweenIndex, normalizeQuotedInValue);
			validate(decl, getDeclarationValue(decl), declarationValueIndex, normalizeQuotedInValue);
		});
	};
};

function zeroIndex() {
	return 0;
}

function oneIndex() {
	return 1;
}

/**
 * @param {string} str
 * @returns {string}
 */
function replaceIrregularWhitespaces(str) {
	return str.replace(IRREGULAR_WHITESPACES_PATTERN, ' ');
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeQuotedInValue(value) {
	const parsed = valueParser(value);

	parsed.walk((node) => {
		if (node.type === 'string' || node.type === 'comment') {
			node.value = replaceIrregularWhitespaces(node.value);
		}
	});

	return parsed.toString();
}

/**
 * @param {string} selector
 * @returns {string}
 */
function normalizeQuotedInSelector(selector) {
	const processor = selectorParser((selectors) => {
		selectors.walk((node) => {
			if (!node.value) return;

			if (isAttribute(node) || isComment(node)) {
				node.value = replaceIrregularWhitespaces(node.value);
			}
		});
	});

	return processor.processSync(selector);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
