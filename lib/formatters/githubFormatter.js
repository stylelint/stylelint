'use strict';

/**
 * @see https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions
 *
 * @type {import('stylelint').Formatter}
 */
module.exports = function githubFormatter(results) {
	const title = 'Stylelint problem';

	return results
		.flatMap(({ source, warnings }) =>
			warnings.map(({ line, column, endLine, endColumn, text, severity }) => {
				return endLine === undefined
					? `::${severity} file=${source},line=${line},col=${column},title=${title}::${text}`
					: `::${severity} file=${source},line=${line},col=${column},endLine=${endLine},endColumn=${endColumn},title=${title}::${text}`;
			}),
		)
		.join('\n');
};
