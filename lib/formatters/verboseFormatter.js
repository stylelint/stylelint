'use strict';

const stringFormatter = require('./stringFormatter');
const { underline, red, yellow, dim, green } = require('picocolors');

/** @typedef {import('stylelint').Formatter} Formatter */
/** @typedef {import('stylelint').Warning} StylelintWarning */

/**
 * @type {Formatter}
 */
module.exports = function (results) {
	let output = stringFormatter(results);

	if (output === '') {
		output = '\n';
	}

	const sourceWord = results.length > 1 ? 'sources' : 'source';
	const ignoredCount = results.filter((result) => result.ignored).length;
	const checkedDisplay = ignoredCount
		? `${results.length - ignoredCount} of ${results.length}`
		: results.length;

	output += underline(`${checkedDisplay} ${sourceWord} checked\n`);
	results.forEach((result) => {
		let formatting = green;

		if (result.errored) {
			formatting = red;
		} else if (result.warnings.length) {
			formatting = yellow;
		} else if (result.ignored) {
			formatting = dim;
		}

		let sourceText = `${result.source}`;

		if (result.ignored) {
			sourceText += ' (ignored)';
		}

		output += formatting(` ${sourceText}\n`);
	});

	const warnings = results.flatMap((r) => r.warnings);
	const warningsBySeverity = groupBy(warnings, (w) => w.severity);
	const problemWord = warnings.length === 1 ? 'problem' : 'problems';

	output += underline(`\n${warnings.length} ${problemWord} found\n`);

	for (const [severityLevel, warningList] of Object.entries(warningsBySeverity)) {
		const warningsByRule = groupBy(warningList, (w) => w.rule);

		output += ` severity level "${severityLevel}": ${warningList.length}\n`;

		for (const [rule, list] of Object.entries(warningsByRule)) {
			output += dim(`  ${rule}: ${list.length}\n`);
		}
	}

	return `${output}\n`;
};

/**
 * @param {StylelintWarning[]} array
 * @param {(w: StylelintWarning) => string} keyFn
 */
function groupBy(array, keyFn) {
	/** @type {{[s: string]: StylelintWarning[]}} */
	const result = {};

	for (const item of array) {
		const key = keyFn(item);

		if (!(key in result)) {
			result[key] = [];
		}

		result[key].push(item);
	}

	return result;
}
