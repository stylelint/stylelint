import { isNumber } from '../utils/validateTypes.mjs';
import preprocessWarnings from './preprocessWarnings.mjs';

/** @typedef {import('stylelint').Warning} Warning */
/** @typedef {Array<Omit<Warning, 'rule'>>} Warnings */

/** @type {import('stylelint').Formatter} */
export default function tapFormatter(results) {
	const lines = [`TAP version 14\n1..${results.length}`];

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

			result.warnings.forEach(({ rule, ...rest }) => {
				const name = rule || 'unknown';
				const array = (rules[name] ??= []);

				array.push(rest);
			});

			for (const [ruleName, array] of Object.entries(rules)) {
				lines.push(`  ${ruleName}:`);

				array.forEach(({ text, severity, line, column, endLine, endColumn }) => {
					lines.push(
						`    - message: "${text}"`,
						`      severity: ${severity}`,
						`      line: ${line}`,
						`      column: ${column}`,
					);
					isNumber(endLine) && lines.push(`      endLine: ${endLine}`);
					isNumber(endColumn) && lines.push(`      endColumn: ${endColumn}`);
				});
			}

			lines.push('  ...');
		}
	}

	lines.push('');

	return lines.join('\n');
}
