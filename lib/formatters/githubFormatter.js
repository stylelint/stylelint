'use strict';

const preprocessWarnings = require('./preprocessWarnings');

/**
 * @see https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions
 *
 * @type {import('stylelint').Formatter}
 */
module.exports = function githubFormatter(results, returnValue) {
	const title = 'Stylelint problem';
	const metadata = returnValue.ruleMetadata;

	const lines = results.flatMap((result) => {
		const { source, warnings } = preprocessWarnings(result);

		return warnings.map(({ line, column, endLine, endColumn, text, severity, rule }) => {
			const msg = buildMessage(text, metadata[rule]);

			return endLine === undefined
				? `::${severity} file=${source},line=${line},col=${column},title=${title}::${msg}`
				: `::${severity} file=${source},line=${line},col=${column},endLine=${endLine},endColumn=${endColumn},title=${title}::${msg}`;
		});
	});

	lines.push('');

	return lines.join('\n');
};

/**
 * @param {string} msg
 * @param {Partial<import('stylelint').RuleMeta> | undefined} metadata
 * @returns {string}
 */
function buildMessage(msg, metadata) {
	if (!metadata) return msg;

	const url = metadata.url ? ` - ${metadata.url}` : '';

	let additional = [
		metadata.fixable ? 'maybe fixable' : '',
		metadata.deprecated ? 'deprecated' : '',
	]
		.filter(Boolean)
		.join(', ');

	additional = additional ? ` [${additional}]` : '';

	return `${msg}${additional}${url}`;
}
