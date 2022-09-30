'use strict';

/**
 * @type {import('stylelint').Formatter}
 */
module.exports = function compactFormatter(results) {
	return results
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
};
