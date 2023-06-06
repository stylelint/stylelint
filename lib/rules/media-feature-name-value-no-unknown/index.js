'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const parseMediaQuery = require('../../utils/parseMediaQuery');
const {
	isMediaFeature,
	isMediaFeatureValue,
	matchesRatioExactly,
} = require('@csstools/media-query-list-parser');
const { isTokenNode, isFunctionNode } = require('@csstools/css-parser-algorithms');
const { TokenType, NumberType } = require('@csstools/css-tokenizer');
const {
	mediaFeatureNameAllowedValueKeywords,
	mediaFeatureNameAllowedValueTypes,
	mediaFeatureNames,
} = require('../../reference/mediaFeatures');
const { lengthUnits } = require('../../reference/units');
const { mathFunctions } = require('../../reference/functions');

const ruleName = 'media-feature-name-value-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (name, value) => `Unexpected value "${value}" for name "${name}"`,
});

const HAS_MIN_MAX_PREFIX = /^(?:min|max)-/i;

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-name-value-no-unknown',
};

const resolutionUnits = new Set([
	// Resolution
	'dpi',
	'dpcm',
	'dppx',
	// "x" is omitted in "reference/units".
	// We do want to include it in this context.
	'x',
]);

/** @typedef {{ mediaFeatureName: string, mediaFeatureNameRaw: string }} State */
/** @typedef { (state: State, valuePart: string, start: number, end: number) => void } Reporter */

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		/**
		 * @param {State} state
		 * @param {import('@csstools/css-tokenizer').CSSToken} token
		 * @param {Reporter} reporter
		 * @returns {void}
		 */
		function checkSingleToken(state, token, reporter) {
			const [type, raw, start, end, parsed] = token;

			if (type === TokenType.Ident) {
				const keyword = parsed.value.toLowerCase();

				// Ignore vendor-prefixed keywords
				if (vendor.prefix(keyword)) return;

				const supportedKeywords = mediaFeatureNameAllowedValueKeywords.get(state.mediaFeatureName);

				if (supportedKeywords && supportedKeywords.has(keyword)) return;

				// An ident that isn't expected for the given media feature name
				reporter(state, raw, start, end);

				return;
			}

			const supportedValueTypes = mediaFeatureNameAllowedValueTypes.get(state.mediaFeatureName);

			if (!supportedValueTypes) {
				reporter(state, raw, start, end);

				return;
			}

			if (type === TokenType.Number) {
				if (parsed.type === NumberType.Integer) {
					if (
						// Integers are valid for "integer" and "ratio".
						supportedValueTypes.has('integer') ||
						supportedValueTypes.has('ratio') ||
						// Integers with value "0" are also valid for "length".
						(parsed.value === 0 &&
							(supportedValueTypes.has('length') || supportedValueTypes.has('resolution')))
					) {
						return;
					}

					// An integer when the media feature doesn't support integers.
					reporter(state, raw, start, end);

					return;
				}

				if (
					// Numbers are valid for "ratio".
					supportedValueTypes.has('ratio') ||
					// Numbers with value "0" are also valid for "length".
					(parsed.value === 0 &&
						(supportedValueTypes.has('length') || supportedValueTypes.has('resolution')))
				) {
					return;
				}

				// A number when the media feature doesn't support numbers.
				reporter(state, raw, start, end);

				return;
			}

			if (type === TokenType.Dimension) {
				const unit = parsed.unit.toLowerCase();

				if (supportedValueTypes.has('resolution') && resolutionUnits.has(unit)) return;

				if (supportedValueTypes.has('length') && lengthUnits.has(unit)) return;

				// An unexpected dimension or a media feature that doesn't support dimensions.
				reporter(state, raw, start, end);

				return;
			}

			// Completely unexpected value
			reporter(state, raw, start, end);
		}

		/**
		 * @param {State} state
		 * @param {import('@csstools/css-parser-algorithms').FunctionNode} functionNode
		 * @param {Reporter} reporter
		 * @returns {void}
		 */
		function checkFunction(state, functionNode, reporter) {
			const functionName = functionNode.getName().toLowerCase();

			// "env()" can represent any value, so it is always valid at build time.
			if (functionName === 'env') return;

			const supportedValueTypes = mediaFeatureNameAllowedValueTypes.get(state.mediaFeatureName);

			if (
				supportedValueTypes &&
				mathFunctions.has(functionName) &&
				(supportedValueTypes.has('integer') ||
					supportedValueTypes.has('length') ||
					supportedValueTypes.has('ratio') ||
					supportedValueTypes.has('resolution'))
			) {
				// TODO : check the units in the function arguments
				// Doesn't have to be correct, but must be known
				return;
			}

			reporter(state, functionNode.toString(), ...startAndEndIndex(functionNode));
		}

		/**
		 * @param {State} state
		 * @param {Array<import('@csstools/css-parser-algorithms').ComponentValue>} componentValues
		 * @param {Reporter} reporter
		 * @returns {void}
		 */
		function checkAspectRatio(state, componentValues, reporter) {
			const supportedValueTypes = mediaFeatureNameAllowedValueTypes.get(state.mediaFeatureName);

			if (
				supportedValueTypes &&
				supportedValueTypes.has('ratio') &&
				matchesRatioExactly(componentValues) !== -1
			) {
				return;
			}

			reporter(
				state,
				componentValues.map((x) => x.toString()).join(''),
				...startAndEndIndex(componentValues),
			);
		}

		/**
		 * @param {State} state
		 * @param {import('@csstools/media-query-list-parser').MediaFeatureValue} valueNode
		 * @param {Reporter} reporter
		 * @returns {void}
		 */
		function checkMediaFeatureValue(state, valueNode, reporter) {
			if (isTokenNode(valueNode.value)) {
				checkSingleToken(state, valueNode.value.value, reporter);

				return;
			}

			if (isFunctionNode(valueNode.value)) {
				checkFunction(state, valueNode.value, reporter);

				return;
			}

			if (Array.isArray(valueNode.value)) {
				checkAspectRatio(state, valueNode.value, reporter);

				return;
			}

			reporter(state, valueNode.value.toString(), ...startAndEndIndex(valueNode.value));
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			/**
			 * @type {Reporter}
			 */
			const reporter = (state, valuePart, start, end) => {
				const atRuleParamIndexValue = atRuleParamIndex(atRule);

				report({
					message: messages.rejected,
					messageArgs: [state.mediaFeatureNameRaw, valuePart],
					index: atRuleParamIndexValue + start,
					endIndex: atRuleParamIndexValue + end,
					node: atRule,
					ruleName,
					result,
				});
			};

			/** @type {State} */
			const state = {
				mediaFeatureName: '',
				mediaFeatureNameRaw: '',
			};

			parseMediaQuery(atRule).forEach((mediaQuery) => {
				mediaQuery.walk((entry) => {
					if (!entry.state) return;

					if (isMediaFeature(entry.node)) {
						entry.state.mediaFeatureNameRaw = entry.node.getName();
						entry.state.mediaFeatureName = entry.state.mediaFeatureNameRaw.toLowerCase();

						if (HAS_MIN_MAX_PREFIX.test(entry.state.mediaFeatureName)) {
							entry.state.mediaFeatureName = entry.state.mediaFeatureName.slice(4);
						}

						if (
							vendor.prefix(entry.state.mediaFeatureName) ||
							!mediaFeatureNames.has(entry.state.mediaFeatureName)
						) {
							// Unknown media feature names are handled by "media-feature-name-no-unknown".
							return;
						}

						return;
					}

					if (!entry.state.mediaFeatureName || !entry.state.mediaFeatureNameRaw) return;

					if (isMediaFeatureValue(entry.node)) {
						checkMediaFeatureValue(entry.state, entry.node, reporter);
					}
				}, state);
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;

/**
 * @template {import('@csstools/css-tokenizer').CSSToken} T
 * @param {Array<{ tokens(): Array<T> }> | { tokens(): Array<T> }} node
 * @returns {[number, number]}
 */
function startAndEndIndex(node) {
	if (Array.isArray(node)) {
		const nodeStart = node[0];

		if (!nodeStart) return [0, 0];

		const nodeEnd = node[node.length - 1] || nodeStart;

		const [startA] = startAndEndIndex(nodeStart);
		const [, endB] = startAndEndIndex(nodeEnd);

		return [startA, endB];
	}

	const tokens = node.tokens();

	const firstToken = tokens[0];
	const lastToken = tokens[tokens.length - 1];

	if (!firstToken || !lastToken) return [0, 0];

	const start = firstToken[2];
	const end = lastToken[3];

	return [start, end];
}
