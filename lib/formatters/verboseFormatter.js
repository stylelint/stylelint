'use strict';

const { underline, red, yellow, dim, green } = require('picocolors');

const pluralize = require('../utils/pluralize');
const stringFormatter = require('./stringFormatter');
const terminalLink = require('./terminalLink');

/** @typedef {import('stylelint').Formatter} Formatter */
/** @typedef {import('stylelint').LintResult} LintResult */
/** @typedef {import('stylelint').Warning} Warning */
/** @typedef {import('stylelint').Severity} Severity */

/**
 * @type {Formatter}
 */
module.exports = function (results, returnValue) {
	let output = stringFormatter(results, returnValue);

	if (output === '') {
		output = '\n';
	}

	const ignoredCount = results.filter((result) => result.ignored).length;
	const checkedDisplay = ignoredCount
		? `${results.length - ignoredCount} of ${results.length}`
		: results.length;

	output += underline(`${checkedDisplay} ${pluralize('source', results.length)} checked\n`);

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

	if (warnings.length === 0) {
		output += '\n0 problems found\n';
	} else {
		const warningsBySeverity = groupBy(warnings, (w) => w.severity);
		const metadata = ruleMetadata(results);

		/**
		 * @param {Severity} severity
		 */
		const printProblems = (severity) => {
			const problems = warningsBySeverity[severity];

			if (problems === undefined) return;

			output += '\n';
			output += underline(`${problems.length} ${pluralize(severity, problems.length)} found\n`);

			const problemsByRule = groupBy(problems, (w) => w.rule);

			for (const [rule, list] of Object.entries(problemsByRule)) {
				output += dim(` ${ruleLink(rule, metadata[rule])}: ${list.length}\n`);
			}
		};

		printProblems('error');
		printProblems('warning');
	}

	return `${output}\n`;
};

/**
 * @template {string} K
 * @param {Warning[]} array
 * @param {(w: Warning) => K} keyFn
 * @returns {Record<K, Warning[]>}
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
