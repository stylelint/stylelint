import picocolors from 'picocolors';
const { underline, red, yellow, dim, green } = picocolors;

import pluralize from '../utils/pluralize.mjs';
import stringFormatter from './stringFormatter.mjs';
import terminalLink from './terminalLink.mjs';

/** @typedef {import('stylelint').Formatter} Formatter */
/** @typedef {import('stylelint').LintResult} LintResult */
/** @typedef {import('stylelint').Warning} Warning */
/** @typedef {import('stylelint').Severity} Severity */
/** @typedef {import('stylelint').RuleMeta} RuleMeta */

/**
 * @type {Formatter}
 */
export default function verboseFormatter(results, returnValue) {
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

		output += formatting(`  ${sourceText}\n`);
	}

	const warnings = results.flatMap((r) => r.warnings);

	if (warnings.length === 0) {
		output += '\n0 problems found\n';
	} else {
		const warningsBySeverity = groupBy(warnings, (w) => w.severity);

		/**
		 * @param {Severity} severity
		 */
		const printProblems = (severity) => {
			const problems = warningsBySeverity[severity];

			if (problems === undefined) return;

			output += '\n';
			output += underline(`${problems.length} ${pluralize(severity, problems.length)} found\n`);

			const problemsByRule = groupBy(problems, (w) => w.rule);
			const metadata = returnValue.ruleMetadata;

			for (const [rule, list] of Object.entries(problemsByRule)) {
				const meta = metadata[rule] || {};

				let additional = [meta.fixable ? 'maybe fixable' : '', meta.deprecated ? 'deprecated' : '']
					.filter(Boolean)
					.join(', ');

				additional = additional ? ` (${additional})` : '';

				output += dim(`  ${ruleLink(rule, meta)}: ${list.length}${additional}\n`);
			}
		};

		printProblems('error');
		printProblems('warning');
	}

	return `${output}\n`;
}

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
 * @param {string} rule
 * @param {Partial<RuleMeta> | undefined} metadata
 * @returns {string}
 */
function ruleLink(rule, metadata) {
	if (metadata && metadata.url) {
		return terminalLink(rule, metadata.url);
	}

	return rule;
}
