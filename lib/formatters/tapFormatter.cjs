// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const validateTypes = require('../utils/validateTypes.cjs');
const preprocessWarnings = require('./preprocessWarnings.cjs');

/** @typedef {import('stylelint').Warning} Warning */
/** @typedef {Array<Omit<Warning, 'rule'>>} Warnings */

/** @type {import('stylelint').Formatter} */
function tapFormatter(results) {
	const lines = ['TAP version 14', `1..${results.length}`];

	for (const [index, result] of results.entries()) {
		preprocessWarnings(result);
		// SKIP indicates "that a test was not run, or if it was,
		// that its success or failure is being temporarily ignored."
		// skipped tests must not be treated as test failures though
		// if a file is ignored, errored is currently always false
		const ignored = result.ignored ? ' # SKIP ignored' : '';
		const error = result.errored ? 'not ' : '';

		lines.push(`${error}ok ${index + 1} - ${result.source}${ignored}`);

		if (error) {
			lines.push('  ---');

			/** @type {Record<string, Warnings>} */
			const rules = {};

			for (const { rule, ...rest } of result.warnings) {
				const name = rule || 'unknown';
				const warnings = (rules[name] ??= []);

				warnings.push(rest);
			}

			for (const [ruleName, array] of Object.entries(rules)) {
				lines.push(`  ${ruleName}:`);

				array.forEach(({ text, severity, line, column, endLine, endColumn }) => {
					lines.push(
						`    - message: "${text}"`,
						`      severity: ${severity}`,
						`      line: ${line}`,
						`      column: ${column}`,
					);

					if (validateTypes.isNumber(endLine)) lines.push(`      endLine: ${endLine}`);

					if (validateTypes.isNumber(endColumn)) lines.push(`      endColumn: ${endColumn}`);
				});
			}

			lines.push('  ...');
		}
	}

	lines.push('');

	return lines.join('\n');
}

module.exports = tapFormatter;
