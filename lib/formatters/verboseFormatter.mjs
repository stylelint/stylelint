import createStyleText from '../utils/createStyleText.mjs';
import pluralize from '../utils/pluralize.mjs';
import stringFormatter from './stringFormatter.mjs';
import terminalLink from './terminalLink.mjs';

/** @import {Formatter, LintResult, RuleMeta, Severity, Warning} from 'stylelint' */

/**
 * @type {Formatter}
 */
export default function verboseFormatter(results, returnValue) {
	const styleText = createStyleText(returnValue?.color);
	let output = stringFormatter(results, returnValue);

	if (output === '') {
		output = '\n';
	}

	const ignoredCount = results.filter((result) => result.ignored).length;
	const checkedDisplay = ignoredCount
		? `${results.length - ignoredCount} of ${results.length}`
		: results.length;

	output += styleText(
		'underline',
		`${checkedDisplay} ${pluralize('source', results.length)} checked\n`,
	);

	for (const result of results) {
		/** @type {import('../utils/createStyleText.mjs').Format} */
		let format = 'green';

		if (result.errored) {
			format = 'red';
		} else if (result.warnings.length) {
			format = 'yellow';
		} else if (result.ignored) {
			format = 'dim';
		}

		let sourceText = fileLink(result.source);

		if (result.ignored) {
			sourceText += ' (ignored)';
		}

		output += styleText(format, `  ${sourceText}\n`);
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
			output += styleText(
				'underline',
				`${problems.length} ${pluralize(severity, problems.length)} found\n`,
			);

			const problemsByRule = groupBy(problems, (w) => w.rule);
			const metadata = returnValue.ruleMetadata;

			for (const [rule, list] of Object.entries(problemsByRule)) {
				const meta = metadata[rule] || {};

				let additional = [meta.fixable ? 'maybe fixable' : '', meta.deprecated ? 'deprecated' : '']
					.filter(Boolean)
					.join(', ');

				additional = additional ? ` (${additional})` : '';

				output += styleText('dim', `  ${ruleLink(rule, meta)}: ${list.length}${additional}\n`);
			}
		};

		printProblems('error');
		printProblems('warning');
	}

	const fixedRules = getFixedRules(results);

	if (fixedRules.size) {
		let lines = '\n';
		let total = 0;

		for (const [name, count] of fixedRules) {
			const meta = returnValue.ruleMetadata[name];

			lines += styleText('dim', `  ${ruleLink(name, meta)}: ${count}\n`);
			total += count;
		}

		output += '\n';
		output += styleText('underline', `${total} ${pluralize('problem', total)} fixed`);
		output += lines;
	}

	return `${output}\n`;
}

/**
 * @template {string} K
 * @param {Warning[]} array
 * @param {(w: Warning) => K} keyFn
 * @returns {Record<K, Warning[]>}
 * @todo replace by Object.groupBy once support for Node.js version 20 is dropped
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

/** @param {LintResult[]} results */
function getFixedRules(results) {
	/** @type {Map<string, number>} */
	const rules = new Map();

	for (const { _postcssResult } of results) {
		if (!_postcssResult) continue; // CSS syntax error

		const {
			stylelint: { fixersData },
		} = _postcssResult;
		const entries = Object.entries(fixersData);

		for (const [ruleName, count] of entries) {
			if (count) rules.set(ruleName, count);
		}
	}

	return rules;
}
