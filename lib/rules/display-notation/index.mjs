import {
	TokenType,
	isTokenComment,
	isTokenEOF,
	isTokenIdent,
	isTokenWhiteSpaceOrComment,
	stringify,
	tokenize,
} from '@csstools/css-tokenizer';

import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import isStandardSyntaxValue from '../../utils/isStandardSyntaxValue.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import setDeclarationValue from '../../utils/setDeclarationValue.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

/** @import {CSSToken,TokenIdent} from '@csstools/css-tokenizer' */

const ruleName = 'display-notation';

const messages = ruleMessages(ruleName, {
	expected: (unexpected, expected) => `Expected "${unexpected}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/display-notation',
	fixable: true,
};

const DISPLAY_OUTSIDE_KEYWORDS = ['block', 'inline', 'run-in'];
const DISPLAY_INSIDE_KEYWORDS = ['flow', 'flow-root', 'table', 'flex', 'grid', 'ruby'];
const DISPLAY_LEGACY_KEYWORDS = ['inline-block', 'inline-table', 'inline-flex', 'inline-grid'];
const DISPLAY_LIST_ITEM_KEYWORD = 'list-item';

const SHORT_OR_LONG_KEYWORD = new RegExp(
	`\\b(?:${[DISPLAY_LIST_ITEM_KEYWORD, ...DISPLAY_OUTSIDE_KEYWORDS, ...DISPLAY_INSIDE_KEYWORDS, ...DISPLAY_LEGACY_KEYWORDS].join('|')})\\b`,
	'i',
);

const DISPLAY_OUTSIDE = new RegExp(`^(?:${DISPLAY_OUTSIDE_KEYWORDS.join('|')})$`, 'i');
const DISPLAY_INSIDE = new RegExp(`^(?:${DISPLAY_INSIDE_KEYWORDS.join('|')})$`, 'i');
const DISPLAY_LIST_ITEM = new RegExp(`^${DISPLAY_LIST_ITEM_KEYWORD}$`, 'i');

const DISPLAY_PROPERTY = /^display$/i;

/** @type {Record<string, Array<string>>} */
const SHORT_TO_LONG = {
	'block list-item': ['block', 'flow', 'list-item'],
	block: ['block', 'flow'],
	flex: ['block', 'flex'],
	'flow list-item': ['block', 'flow', 'list-item'],
	flow: ['block', 'flow'],
	'flow-root': ['block', 'flow-root'],
	grid: ['block', 'grid'],
	'inline list-item': ['inline', 'flow', 'list-item'],
	inline: ['inline', 'flow'],
	'inline-block': ['inline', 'flow-root'],
	'inline-flex': ['inline', 'flex'],
	'inline-grid': ['inline', 'grid'],
	'inline-table': ['inline', 'table'],
	'list-item': ['block', 'flow', 'list-item'],
	ruby: ['inline', 'ruby'],
	'run-in': ['run-in', 'flow'],
	table: ['block', 'table'],
};

/** @type {Record<string, Array<string>>} */
const LONG_TO_SHORT = {
	'block flex': ['flex'],
	'block flow list-item': ['list-item'],
	'block flow': ['block'],
	'block flow-root': ['flow-root'],
	'block grid': ['grid'],
	'block list-item': ['list-item'],
	'block table': ['table'],
	'flow list-item': ['list-item'],
	'inline flex': ['inline-flex'],
	'inline flow list-item': ['inline', 'list-item'],
	'inline flow': ['inline'],
	'inline flow-root': ['inline-block'],
	'inline grid': ['inline-grid'],
	'inline ruby': ['ruby'],
	'inline table': ['inline-table'],
	'run-in flow': ['run-in'],
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['short', 'full'],
		});

		if (!validOptions) return;

		root.walkDecls(DISPLAY_PROPERTY, (decl) => {
			const value = getDeclarationValue(decl);

			if (!SHORT_OR_LONG_KEYWORD.test(value)) return;

			if (!isStandardSyntaxValue(value)) return;

			const tokens = tokenize({ css: value });

			// ignore values that contain functions or other non-keyword values
			const hasNonKeywordTokens = tokens.some(
				(token) => !(isTokenWhiteSpaceOrComment(token) || isTokenEOF(token) || isTokenIdent(token)),
			);

			if (hasNonKeywordTokens) return;

			const keywords = tokens.filter(isTokenIdent);

			if (!keywords.length) return;

			const normalizedValue = normalizeValue(keywords);

			const replacementValue =
				primary === 'short' ? LONG_TO_SHORT[normalizedValue] : SHORT_TO_LONG[normalizedValue];

			if (!replacementValue) return;

			const firstKeyword = keywords.at(0);
			const lastKeyword = keywords.at(-1);

			if (!firstKeyword || !lastKeyword) return;

			const index = declarationValueIndex(decl);

			report({
				message: messages.expected,
				messageArgs: [normalizedValue, replacementValue.join(' ')],
				node: decl,
				index: index + firstKeyword[2],
				endIndex: index + lastKeyword[3] + 1,
				result,
				ruleName,
				fix: {
					apply: () => {
						setDeclarationValue(
							decl,
							fixValue(tokens, firstKeyword, lastKeyword, replacementValue),
						);
					},
					node: decl,
				},
			});
		});
	};
};

/**
 * @param {string} a
 * @returns {number}
 */
function keywordOrder(a) {
	if (DISPLAY_OUTSIDE.test(a)) return 1;

	if (DISPLAY_INSIDE.test(a)) return 2;

	if (DISPLAY_LIST_ITEM.test(a)) return 3;

	return 0;
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function compareKeywords(a, b) {
	return keywordOrder(a) - keywordOrder(b);
}

/**
 * @param {Array<TokenIdent>} tokens
 * @returns {string}
 */
function normalizeValue(tokens) {
	return tokens
		.map((token) => token[4].value)
		.sort(compareKeywords)
		.join(' ')
		.toLowerCase();
}

/**
 * @param {Array<CSSToken>} originalValue
 * @param {TokenIdent} firstKeyword
 * @param {TokenIdent} lastKeyword
 * @param {Array<string>} replacement
 * @returns {string}
 */
function fixValue(originalValue, firstKeyword, lastKeyword, replacement) {
	const before = originalValue.slice(0, originalValue.indexOf(firstKeyword));
	const commentsBetweenKeywords = originalValue
		.slice(originalValue.indexOf(firstKeyword), originalValue.indexOf(lastKeyword))
		.filter(isTokenComment);
	const after = originalValue.slice(originalValue.indexOf(lastKeyword) + 1);

	return stringify(
		...before,
		...replacement.flatMap((keyword, index) => {
			/** @type {Array<CSSToken>} */
			const tokens = [];

			if (index !== 0) {
				tokens.push([TokenType.Whitespace, ' ', -1, -1, undefined]);
			}

			tokens.push([TokenType.Ident, keyword, -1, -1, { value: keyword }]);

			return tokens;
		}),
		...commentsBetweenKeywords,
		...after,
	);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
