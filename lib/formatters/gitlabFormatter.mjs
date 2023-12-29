import hash from './../utils/hash.mjs';
import preprocessWarnings from './preprocessWarnings.mjs';

/**
 * @type {import('stylelint').Formatter}
 */
export default function jsonFormatter(results, returnValue) {
	const metadata = returnValue.ruleMetadata;
	const items = results.flatMap((result) => {
		const { source, warnings } = preprocessWarnings(result);

		return warnings.map(({ line, column, endLine, endColumn, text, severity, rule }) => {
			/** @type {import('stylelint').GitlabFormatterIssueLocation} */
			let location = {
				path: source,
				positions: {
					begin: {
						line,
						column,
					},
				},
			};

			if (endLine !== undefined) {
				location.positions = {
					...location.positions,
					end: {
						line: endLine,
						column: endColumn,
					},
				};
			}

			return {
				description: buildMessage(text, metadata[rule]),
				check_name: rule,
				fingerprint: hash(`${source}:${line}:${column}:${rule}`),
				severity: mapSeverity(severity),
				location,
			};
		});
	});

	return JSON.stringify(items);
}

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

/**
 * @param {string} severity
 * @returns {string}
 */
function mapSeverity(severity) {
	switch (severity) {
		case 'error':
			return 'major';
		default:
			return 'minor';
	}
}
