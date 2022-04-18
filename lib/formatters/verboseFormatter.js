'use strict';

const stringFormatter = require('./stringFormatter');
const { underline, red, yellow, dim, green } = require('picocolors');
const terminalLink = require('./terminalLink');

/** @typedef {import('stylelint').Formatter} Formatter */
/** @typedef {import('stylelint').LintResult} LintResult */
/** @typedef {import('stylelint').Warning} Warning */

/**
 * @type {Formatter}
 */
module.exports = function (results, returnValue) {
	let output = stringFormatter(results, returnValue);

	if (output === '') {
		output = '\n';
	}

	const sourceWord = results.length > 1 ? 'sources' : 'source';
	const ignoredCount = results.filter((result) => result.ignored).length;
	const checkedDisplay = ignoredCount
		? `${results.length - ignoredCount} of ${results.length}`
		: results.length;

	output += underline(`${checkedDisplay} ${sourceWord} checked\n`);

	for (const result of results) {
		let formatting = green;

		if (result.errored) {
			formatting = red;
		} else if (result.warnings.length) {
			formatting = yellow;
		} else if (result.ignored) {
			formatting = dim;
		}

		let sourceText = fileLink(result.source);

		if (result.ignored) {
			sourceText += ' (ignored)';
		}

		output += formatting(` ${sourceText}\n`);
	}

	const warnings = results.flatMap((r) => r.warnings);
	const warningsBySeverity = groupBy(warnings, (w) => w.severity);
	const problemWord = warnings.length === 1 ? 'problem' : 'problems';

	output += underline(`\n${warnings.length} ${problemWord} found\n`);

	const metadata = ruleMetadata(results);

	for (const [severityLevel, warningList] of Object.entries(warningsBySeverity)) {
		const warningsByRule = groupBy(warningList, (w) => w.rule);

		output += ` severity level "${severityLevel}": ${warningList.length}\n`;

		for (const [rule, list] of Object.entries(warningsByRule)) {
			output += dim(`  ${ruleLink(rule, metadata[rule])}: ${list.length}\n`);
		}
	}

	return `${output}\n`;
};

/**
 * @param {Warning[]} array
 * @param {(w: Warning) => string} keyFn
 * @returns {Record<string, Warning[]>}
 */
function groupBy(array, keyFn) {
	/** @type {Record<string, Warning[]>} */
	const result = {};

	for (const item of array) {
		const key = keyFn(item);
		let warnings = result[key];

		if (warnings === undefined) {
			result[key] = warnings = [];
		}

		warnings.push(item);
	}

	return result;
}

/**
 * @param {string | undefined} source
 * @returns {string}
 */
function fileLink(source) {
	if (!source || source.startsWith('<')) {
		return `${source}`;
	}

	return terminalLink(source, `file://${source}`);
}

/**
 * @param {LintResult[]} results
 * @returns {Record<string, { url?: string }>}
 */
function ruleMetadata(results) {
	const firstResult = results[0];

	return (
		(firstResult &&
			firstResult._postcssResult &&
			firstResult._postcssResult.stylelint &&
			firstResult._postcssResult.stylelint.ruleMetadata) ||
		{}
	);
}

/**
 * @param {string} rule
 * @param {{ url?: string } | undefined} metadata
 * @returns {string}
 */
function ruleLink(rule, metadata) {
	if (metadata && metadata.url) {
		return terminalLink(rule, metadata.url);
	}

	return rule;
}
