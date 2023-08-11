'use strict';

const preprocessWarnings = require('./preprocessWarnings.cjs');

/**
 * @type {import('stylelint').Formatter}
 */
function compactFormatter(results) {
	return results
		.flatMap((result) => {
			const { warnings } = preprocessWarnings(result);

			return warnings.map(
				(warning) =>
					`${result.source}: ` +
					`line ${warning.line}, ` +
					`col ${warning.column}, ` +
					`${warning.severity} - ` +
					`${warning.text}`,
			);
		})
		.join('\n');
}

module.exports = compactFormatter;
