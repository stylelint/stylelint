'use strict';

const cssTokenizer = require('@csstools/css-tokenizer');
const mediaQueryListParser = require('@csstools/media-query-list-parser');
const cssParserAlgorithms = require('@csstools/css-parser-algorithms');

/** @typedef {Array<import('@csstools/media-query-list-parser').MediaQuery>} MediaQueryList */
/** @typedef {import('@csstools/css-tokenizer').TokenIdent} TokenIdent */
/** @typedef {{ stringify: () => string }} MediaQuerySerializer */

const rangeFeatureOperator = /[<>=]/;

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
function findMediaFeatureNames(mediaQueryParams, callback) {
	const tokens = cssTokenizer.tokenize({ css: mediaQueryParams });
	const list = cssParserAlgorithms.parseCommaSeparatedListOfComponentValues(tokens);

	const mediaQueryConditions = list.flatMap((listItem) => {
		return listItem.flatMap((componentValue) => {
			if (
				!cssParserAlgorithms.isSimpleBlockNode(componentValue) ||
				componentValue.startToken[0] !== cssTokenizer.TokenType.OpenParen
			) {
				return [];
			}

			const blockTokens = componentValue.tokens();

			const mediaQueryList = mediaQueryListParser.parseFromTokens(blockTokens, {
				preserveInvalidMediaQueries: true,
			});

			return mediaQueryList.filter((mediaQuery) => {
				return !mediaQueryListParser.isMediaQueryInvalid(mediaQuery);
			});
		});
	});

	mediaQueryConditions.forEach((mediaQuery) => {
		mediaQuery.walk(({ node }) => {
			if (mediaQueryListParser.isMediaFeature(node)) {
				const token = node.getNameToken();

				if (token[0] !== cssTokenizer.TokenType.Ident) return;

				callback(token);
			}

			if (mediaQueryListParser.isGeneralEnclosed(node)) {
				topLevelTokenNodes(node).forEach((token, i, topLevelTokens) => {
					if (token[0] !== cssTokenizer.TokenType.Ident) {
						return;
					}

					const nextToken = topLevelTokens[i + 1];
					const prevToken = topLevelTokens[i - 1];

					if (
						// Media Feature
						(!prevToken && nextToken && nextToken[0] === cssTokenizer.TokenType.Colon) ||
						// Range Feature
						(nextToken &&
							nextToken[0] === cssTokenizer.TokenType.Delim &&
							rangeFeatureOperator.test(nextToken[4].value)) ||
						// Range Feature
						(prevToken &&
							prevToken[0] === cssTokenizer.TokenType.Delim &&
							rangeFeatureOperator.test(prevToken[4].value))
					) {
						callback(token);
					}
				});
			}
		});
	});

	// Serializing takes time/resources and not all callers will use this.
	// By returning an object with a stringify method, we can avoid doing
	// this work when it's not needed.
	return {
		stringify() {
			return cssTokenizer.stringify(...tokens);
		},
	};
}

/** @param {import('@csstools/media-query-list-parser').GeneralEnclosed} node */
function topLevelTokenNodes(node) {
	const components = node.value.value;

	if (cssTokenizer.isToken(components) || components.length === 0 || cssTokenizer.isToken(components[0])) {
		return [];
	}

	/** @type {Array<import('@csstools/css-tokenizer').CSSToken>} */
	const relevantTokens = [];

	// To consume the next token if it is a scss variable
	let lastWasDollarSign = false;

	components.forEach((component) => {
		// Only preserve top level tokens (idents, delims, ...)
		// Discard all blocks, functions, ...
		if (component && cssParserAlgorithms.isTokenNode(component)) {
			if (component.value[0] === cssTokenizer.TokenType.Delim && component.value[4].value === '$') {
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

module.exports = findMediaFeatureNames;
