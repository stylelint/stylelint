'use strict';

/**
 * @type {import('stylelint').Formatter}
 */
const unixFormatter = (results) => {
	const lines = results.flatMap((result) =>
		result.warnings.map(
			(warning) =>
				`${result.source}:${warning.line}:${warning.column}: ` +
				`${warning.text} [${warning.severity}]\n`,
		),
	);
	const total = lines.length;
	let output = lines.join('');

	if (total > 0) {
		output += `\n${total} problem${total !== 1 ? 's' : ''}\n`;
	}

	return output;
};

module.exports = unixFormatter;
