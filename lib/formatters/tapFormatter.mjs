import { isNumber } from '../utils/validateTypes.mjs';
import preprocessWarnings from './preprocessWarnings.mjs';

/** @import {Warning} from 'stylelint' */
/** @typedef {Array<Omit<Warning, 'rule'>>} Warnings */

/** @type {import('stylelint').Formatter} */
export default function tapFormatter(results) {
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

			for (const [ruleName, warnings] of Object.entries(rules)) {
				lines.push(`  ${ruleName}:`);

				for (const { text, severity, line, column, endLine, endColumn } of warnings) {
					lines.push(
						`    - message: "${text}"`,
						`      severity: ${severity}`,
						`      line: ${line}`,
						`      column: ${column}`,
					);

					if (isNumber(endLine)) lines.push(`      endLine: ${endLine}`);

					if (isNumber(endColumn)) lines.push(`      endColumn: ${endColumn}`);
				}
			}

			lines.push('  ...');
		}
	}

	lines.push('');

	return lines.join('\n');
}
