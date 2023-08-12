import preprocessWarnings from './preprocessWarnings.mjs';

/**
 * @type {import('stylelint').Formatter}
 */
export default function tapFormatter(results) {
	const lines = [`TAP version 13\n1..${results.length}`];

	for (const [index, result] of results.entries()) {
		preprocessWarnings(result);

		lines.push(
			`${result.errored ? 'not ok' : 'ok'} ${index + 1} - ${result.ignored ? 'ignored ' : ''}${
				result.source
			}`,
		);

		if (result.warnings.length > 0) {
			lines.push('---', 'messages:');

			for (const warning of result.warnings) {
				lines.push(
					` - message: "${warning.text}"`,
					`   severity: ${warning.severity}`,
					`   data:`,
					`     line: ${warning.line}`,
					`     column: ${warning.column}`,
				);

				if (typeof warning.endLine === 'number') {
					lines.push(`     endLine: ${warning.endLine}`);
				}

				if (typeof warning.endColumn === 'number') {
					lines.push(`     endColumn: ${warning.endColumn}`);
				}

				if (typeof warning.rule === 'string') {
					lines.push(`     ruleId: ${warning.rule}`);
				}
			}

			lines.push('---');
		}
	}

	lines.push('');

	return lines.join('\n');
}
