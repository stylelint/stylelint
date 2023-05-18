'use strict';

const { TokenType, isToken, stringify, tokenize } = require('@csstools/css-tokenizer');
const {
	TokenNode,
	isTokenNode,
	parseCommaSeparatedListOfComponentValues,
} = require('@csstools/css-parser-algorithms');
const {
	isGeneralEnclosed,
	isMediaFeature,
	isMediaQueryInvalid,
	parseFromTokens,
} = require('@csstools/media-query-list-parser');

/** @typedef {Array<import('@csstools/media-query-list-parser').MediaQuery>} MediaQueryList */
/** @typedef {import('@csstools/css-tokenizer').TokenIdent} TokenIdent */
/** @typedef {{ stringify: () => string }} MediaQuerySerializer */

const rangeFeatureOperator = /[<>=]/;
const nonStandardSyntaxMarkers = /[#@${]/;
const startsWithNonStandardSyntaxMarker = /^[#@${]/;

/**
 * Search a CSS string for Media Feature names.
 * For every found name, invoke the callback, passing the token
 * as an argument.
 *
 * Found tokens are mutable and modifications made to them will be reflected in the output.
 *
 * This function supports some non-standard syntaxes like SCSS variables and interpolation.
 *
 * @param {string} mediaQueryParams
 * @param {(mediaFeatureName: TokenIdent) => void} callback
 *
 * @returns {MediaQuerySerializer}
 */
module.exports = function findMediaFeatureNamesSearch(mediaQueryParams, callback) {
	const [tokens, hasNonStandardSyntax] = normalizeTokenStreamForMediaQueryListParser(
		tokenize({ css: mediaQueryParams }),
		mediaQueryParams,
	);

	const mediaQueryList = parseFromTokens(tokens, {
		preserveInvalidMediaQueries: true,
	});

	mediaQueryList.forEach((mediaQuery) => {
		if (isMediaQueryInvalid(mediaQuery)) return;

		mediaQuery.walk(({ node }) => {
			if (isMediaFeature(node)) {
				const token = node.getNameToken();

				if (token[0] !== TokenType.Ident) return;

				const raw = token[1];

				if (startsWithNonStandardSyntaxMarker.test(raw)) return;

				callback(token);
			}

			if (hasNonStandardSyntax && isGeneralEnclosed(node)) {
				const relevantTokens = topLevelTokenNodes(node);

				if (!relevantTokens) {
					return;
				}

				relevantTokens.forEach((token, i) => {
					if (token[0] !== TokenType.Ident) {
						return;
					}

					const nextToken = relevantTokens[i + 1];
					const prevToken = relevantTokens[i - 1];

					if (
						// Media Feature
						(!prevToken && nextToken && nextToken[0] === TokenType.Colon) ||
						// Range Feature
						(nextToken &&
							nextToken[0] === TokenType.Delim &&
							rangeFeatureOperator.test(nextToken[4].value)) ||
						// Range Feature
						(prevToken &&
							prevToken[0] === TokenType.Delim &&
							rangeFeatureOperator.test(prevToken[4].value))
					) {
						callback(token);
					}
				});
			}
		});
	});

	return {
		stringify() {
			return mediaQueryList.map((mediaQuery) => mediaQuery.toString()).join(',');
		},
	};
};

/**
 * Normalize the token stream for the media query list parser.
 *
 * The CSSToken construct is quite flexible and can be used to "lie" to the parser.
 * - take all non-standard components and sequences of components that are used as variables or as interpolation.
 * - replace these with a single Ident token that has the same raw value as the original token sequence.
 *
 * The result is something that parses as standard CSS, but serializes to the original input.
 *
 * @param {Array<import('@csstools/css-tokenizer').CSSToken>} tokens
 * @param {string} mediaQueryParams
 * @returns {[Array<import('@csstools/css-tokenizer').CSSToken>, boolean]}
 */
function normalizeTokenStreamForMediaQueryListParser(tokens, mediaQueryParams) {
	let hasNonStandardSyntax = false;

	if (nonStandardSyntaxMarkers.test(mediaQueryParams)) {
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];

			if (!token) break;

			const [tokenType, raw] = token;

			if (
				tokenType === TokenType.AtKeyword ||
				tokenType === TokenType.OpenCurly ||
				(tokenType === TokenType.Delim && nonStandardSyntaxMarkers.test(raw))
			) {
				hasNonStandardSyntax = true;
				break;
			}
		}
	}

	if (hasNonStandardSyntax) {
		const list = parseCommaSeparatedListOfComponentValues(tokens);

		list.forEach((listItem) => {
			listItem.forEach((componentValue, index) => {
				if (isTokenNode(componentValue)) {
					// @media @tablet {}
					if (componentValue.value[0] === TokenType.AtKeyword) {
						componentValue.value = [
							TokenType.Ident,
							componentValue.value[1],
							componentValue.value[2],
							componentValue.value[3],
							{ value: componentValue.value[4].value },
						];

						return;
					}

					// @media #{foo} {}
					// @media $foo {}
					// @media ${foo} {}
					// @media @@foo {}
					// @media @{foo} {}
					if (
						componentValue.value[0] === TokenType.Delim &&
						(componentValue.value[4].value === '$' ||
							componentValue.value[4].value === '#' ||
							componentValue.value[4].value === '@')
					) {
						const nextComponentValue = listItem[index + 1];

						if (!nextComponentValue) return;

						const nextComponentValueTokens = nextComponentValue.tokens();
						const lastComponentValueToken =
							nextComponentValueTokens[nextComponentValueTokens.length - 1];

						if (!lastComponentValueToken) return;

						let raw = stringify(componentValue.value, ...nextComponentValueTokens);

						listItem.splice(
							index,
							2,
							new TokenNode([
								TokenType.Ident,
								raw,
								componentValue.value[2],
								lastComponentValueToken[3],
								{
									value: raw,
								},
							]),
						);
					}
				}
			});
		});

		tokens = list.flatMap((listItem) =>
			listItem.flatMap((componentValue) => componentValue.tokens()),
		);
	}

	return [tokens, hasNonStandardSyntax];
}

/** @param {import('@csstools/media-query-list-parser').GeneralEnclosed} node */
function topLevelTokenNodes(node) {
	const components = node.value.value;

	if (isToken(components) || components.length === 0 || isToken(components[0])) {
		return false;
	}

	/** @type {Array<import('@csstools/css-tokenizer').CSSToken>} */
	const relevantTokens = [];

	// To consume the next token if it is a scss variable
	let lastWasDollarSign = false;

	components.forEach((component) => {
		// Only preserve top level tokens (idents, delims, ...)
		// Discard all blocks, functions, ...
		if (component && isTokenNode(component)) {
			if (component.value[0] === TokenType.Delim && component.value[4].value === '$') {
				lastWasDollarSign = true;

				return;
			}

			if (lastWasDollarSign) {
				lastWasDollarSign = false;

				return;
			}

			relevantTokens.push(component.value);
		}
	});

	return relevantTokens;
}
