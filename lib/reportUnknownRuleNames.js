'use strict';

const levenshteinDistance = require('./utils/levenshteinDistance');
const rules = require('./rules');

const MAX_LEVENSHTEIN_DISTANCE = 6;
const MAX_SUGGESTIONS_COUNT = 3;

/**
 * @param {string} ruleName
 * @return {string[]}
 */
function extractSuggestions(ruleName) {
	const suggestions = new Array(MAX_LEVENSHTEIN_DISTANCE);

	for (let i = 0; i < suggestions.length; i++) {
		suggestions[i] = [];
	}

	rules.forEach((existRuleName) => {
		const distance = levenshteinDistance(existRuleName, ruleName, MAX_LEVENSHTEIN_DISTANCE);

		if (distance > 0) {
			suggestions[distance - 1].push(existRuleName);
		}
	});

	/** @type {string[]} */
	let result = [];

	for (let i = 0; i < suggestions.length; i++) {
		if (suggestions[i].length > 0) {
			if (i < 3) {
				return suggestions[i].slice(0, MAX_SUGGESTIONS_COUNT);
			}

			result = result.concat(suggestions[i]);
		}
	}

	return result.slice(0, MAX_SUGGESTIONS_COUNT);
}

/**
 * @param {string} ruleName
 * @param {string[]} [suggestions=[]]
 * @return {string}
 */
function rejectMessage(ruleName, suggestions = []) {
	return (
		`Unknown rule ${ruleName}.` +
		(suggestions.length > 0 ? ` Did you mean ${suggestions.join(', ')}?` : '')
	);
}

/** @type {Map<string, string[]>} */
const cache = new Map();

/**
 * @param {string} unknownRuleName
 * @param {import('postcss').Root} postcssRoot
 * @param {import('stylelint').PostcssResult} postcssResult
 * @returns {void}
 */
module.exports = function reportUnknownRuleNames(unknownRuleName, postcssRoot, postcssResult) {
	const suggestions = cache.has(unknownRuleName)
		? /** @type {string[]} */ (cache.get(unknownRuleName))
		: extractSuggestions(unknownRuleName);
	const warningProperties = {
		severity: 'error',
		rule: unknownRuleName,
		node: postcssRoot,
		index: 0,
	};

	cache.set(unknownRuleName, suggestions);
	postcssResult.warn(rejectMessage(unknownRuleName, suggestions), warningProperties);
};
