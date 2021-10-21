'use strict';

/**
 * @type {import('stylelint').Formatter}
 */
const formatter = (results) =>
	results
		.flatMap((result) =>
			result.warnings.map(
				(warning) =>
					`${result.source}: ` +
					`line ${warning.line}, ` +
					`col ${warning.column}, ` +
					`${warning.severity} - ` +
					`${warning.text}`,
			),
		)
		.join('\n');

module.exports = formatter;
