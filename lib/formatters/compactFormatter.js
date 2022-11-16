'use strict';

const preprocessWarnings = require('./preprocessWarnings');

/**
 * @type {import('stylelint').Formatter}
 */
module.exports = function compactFormatter(results) {
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
};
