'use strict';

/**
 * @type {import('stylelint').Formatter}
 */
module.exports = function tapFormatter(results) {
	const lines = [`TAP version 13\n1..${results.length}`];

	for (const [index, result] of results.entries()) {
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
					`     endLine: ${warning.endLine}`,
					`     endColumn: ${warning.endColumn}`,
					`     ruleId: ${warning.rule}`,
				);
			}

			lines.push('---');
		}
	}

	lines.push('');

	return lines.join('\n');
};
