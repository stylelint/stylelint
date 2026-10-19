const INDENTATION_OF_LINES_WITH_CONTENT = /^[^\S\n]*(?=\S)/gm;

/**
 * Strip the shortest indentation of the lines with content, then trim,
 * matching `stripIndent` from `common-tags`.
 *
 * @param {TemplateStringsArray} strings
 * @param {...unknown} values
 * @returns {string}
 */
export default function stripIndent(strings, ...values) {
	const text = strings.reduce((result, string, index) => `${result}${values[index - 1]}${string}`);
	const indentations = text.match(INDENTATION_OF_LINES_WITH_CONTENT);

	if (!indentations) return '';

	const shortestIndentation = Math.min(...indentations.map((indentation) => indentation.length));

	return text.replace(new RegExp(`^[^\\S\\n]{${shortestIndentation}}`, 'gm'), '').trim();
}
