import { relative, sep } from 'node:path';
import process from 'node:process';

import { alignCenter, alignLeft, alignRight } from '../utils/alignText.mjs';
import calcSeverityCounts from './calcSeverityCounts.mjs';
import createStyleText from '../utils/createStyleText.mjs';
import getColumnWidth from '../utils/getColumnWidth.mjs';
import isUnicodeSupported from '../utils/isUnicodeSupported.mjs';
import pluralize from '../utils/pluralize.mjs';
import preprocessWarnings from './preprocessWarnings.mjs';
import terminalLink from './terminalLink.mjs';
import wrapText from './wrapText.mjs';

const INDENT = '  ';
const SEPARATOR = '  ';

// The indent, the colon of `line:column` and the three separators between the four cells of a row
const MARGIN_WIDTHS = INDENT.length + 1 + 3 * SEPARATOR.length;

/** @import { Format, StyleText } from '../utils/createStyleText.mjs' */

/**
 * @typedef {{ line: string, column: string, symbol: string, text: string, rule: string }} Row
 * @typedef {Record<keyof Row, number>} ColumnWidths
 */

const supportsUnicode = isUnicodeSupported();

const symbols = {
	info: supportsUnicode ? 'ℹ' : 'i',
	warning: supportsUnicode ? '⚠' : '‼',
	error: supportsUnicode ? '✖' : '×',
	success: supportsUnicode ? '✔' : '√',
};

/** @type {Record<keyof typeof symbols, Format>} */
const levelColors = {
	info: 'blue',
	warning: 'yellow',
	error: 'red',
	success: 'green',
};

/**
 * @param {keyof typeof symbols} level
 * @param {StyleText} styleText
 * @returns {string}
 */
function formatSymbol(level, styleText) {
	return styleText(levelColors[level], symbols[level]);
}

/**
 * @param {import('stylelint').LintResult[]} results
 * @param {StyleText} styleText
 * @returns {string}
 */
function deprecationsFormatter(results, styleText) {
	const allDeprecationWarnings = results.flatMap((result) => result.deprecations || []);

	if (allDeprecationWarnings.length === 0) {
		return '';
	}

	const seenText = new Set();
	const lines = [];

	for (const { text, reference } of allDeprecationWarnings) {
		if (seenText.has(text)) continue;

		seenText.add(text);

		let line = ` ${styleText('dim', '-')} ${text}`;

		if (reference) {
			line += styleText('dim', ` See: ${styleText('underline', reference)}`);
		}

		lines.push(line);
	}

	return ['', styleText('yellow', 'Deprecation warnings:'), ...lines, ''].join('\n');
}

/**
 * @param {import('stylelint').LintResult[]} results
 * @param {StyleText} styleText
 * @returns {string}
 */
function invalidOptionsFormatter(results, styleText) {
	const allInvalidOptionWarnings = results.flatMap((result) =>
		(result.invalidOptionWarnings || []).map((warning) => warning.text),
	);
	const uniqueInvalidOptionWarnings = [...new Set(allInvalidOptionWarnings)];

	return uniqueInvalidOptionWarnings.reduce((output, warning) => {
		output += styleText('red', 'Invalid Option: ');
		output += warning;

		return `${output}\n`;
	}, '\n');
}

/**
 * @param {string} fromValue
 * @param {string} cwd
 * @param {StyleText} styleText
 * @returns {string}
 */
function logFrom(fromValue, cwd, styleText) {
	if (fromValue.startsWith('<')) {
		return styleText('underline', fromValue);
	}

	const filePath = relative(cwd, fromValue).split(sep).join('/');

	return terminalLink(filePath, `file://${fromValue}`);
}

/**
 * @param {import('stylelint').Warning} message
 * @returns {string}
 */
function formatMessageText(message) {
	let result = message.text;

	result = result
		// Remove all control characters (newline, tab and etc)
		.replace(/[\u0001-\u001A]+/g, ' ') // eslint-disable-line no-control-regex
		.replace(/\.$/, '');

	const ruleString = ` (${message.rule})`;

	if (result.endsWith(ruleString)) {
		result = result.slice(0, result.lastIndexOf(ruleString));
	}

	return result;
}

/**
 * @param {import('stylelint').Warning} message
 * @param {StyleText} styleText
 * @returns {Row}
 */
function createRow(message, styleText) {
	const { line, column, severity } = message;

	return {
		line: line ? line.toString() : '',
		column: column ? column.toString() : '',
		symbol: symbols[severity] ? formatSymbol(severity, styleText) : severity,
		text: formatMessageText(message),
		rule: message.rule || '',
	};
}

/**
 * @param {ColumnWidths} widths
 * @returns {number}
 */
function getMessageWidth(widths) {
	if (!process.stdout.isTTY) {
		return widths.text;
	}

	const availableWidth = process.stdout.columns < 80 ? 80 : process.stdout.columns;
	const fullWidth = Object.values(widths).reduce((a, b) => a + b);

	// If there is no reason to wrap the text, don't align the last column to the right
	if (availableWidth > fullWidth + MARGIN_WIDTHS) {
		return widths.text;
	}

	return Math.max(1, availableWidth - (fullWidth - widths.text + MARGIN_WIDTHS));
}

/**
 * @param {Row} row
 * @returns {boolean}
 */
function hasPosition({ line, column }) {
	return line !== '' || column !== '';
}

/**
 * @param {Row} row
 * @param {ColumnWidths} widths
 * @returns {string}
 */
function formatPosition(row, widths) {
	const colon = hasPosition(row) ? ':' : ' ';

	return `${alignRight(row.line, widths.line)}${colon}${alignLeft(row.column, widths.column)}`;
}

/**
 * @param {Row} row
 * @param {ColumnWidths} widths
 * @param {number} messageWidth
 * @param {StyleText} styleText
 * @returns {string[]}
 */
function formatRow(row, widths, messageWidth, styleText) {
	const { symbol, text, rule } = row;
	const position = formatPosition(row, widths);
	const ruleCell = rule === '' ? '' : styleText('dim', rule);

	return wrapText(text, messageWidth).map((textLine, index) => {
		const isFirstLine = index === 0;
		const cells = [
			isFirstLine ? styleText('dim', position) : ' '.repeat(position.length),
			alignCenter(isFirstLine ? symbol : '', widths.symbol),
			alignLeft(textLine, messageWidth),
			isFirstLine ? ruleCell : '',
		];

		return `${INDENT}${cells.join(SEPARATOR)}`.trimEnd();
	});
}

/**
 * @param {import('stylelint').Warning[]} messages
 * @param {string} source
 * @param {string} cwd
 * @param {StyleText} styleText
 * @returns {string}
 */
function formatter(messages, source, cwd, styleText) {
	if (messages.length === 0) return '';

	let output = '\n';

	if (source) {
		output += `${logFrom(source, cwd, styleText)}\n`;
	}

	const rows = messages.map((message) => createRow(message, styleText));
	const widths = {
		line: getColumnWidth(rows, 'line'),
		column: getColumnWidth(rows, 'column'),
		symbol: getColumnWidth(rows, 'symbol'),
		text: getColumnWidth(rows, 'text'),
		rule: getColumnWidth(rows, 'rule'),
	};
	const messageWidth = getMessageWidth(widths);
	const lines = rows.flatMap((row) => formatRow(row, widths, messageWidth, styleText));

	return `${output}${lines.join('\n')}\n`;
}

/**
 * @type {import('stylelint').Formatter}
 */
export default function stringFormatter(results, returnValue) {
	const styleText = createStyleText(returnValue?.color);
	let output = invalidOptionsFormatter(results, styleText);

	output += deprecationsFormatter(results, styleText);

	const resultCounts = { error: 0, warning: 0 };
	const fixableCounts = { error: 0, warning: 0 };

	output = results.reduce((accum, result) => {
		preprocessWarnings(result);

		accum += formatter(
			result.warnings,
			result.source || '',
			(returnValue && returnValue.cwd) || process.cwd(),
			styleText,
		);

		for (const warning of result.warnings) {
			calcSeverityCounts(warning.severity, resultCounts);
			const fixable = returnValue.ruleMetadata?.[warning.rule]?.fixable;

			if (fixable === true) {
				calcSeverityCounts(warning.severity, fixableCounts);
			}
		}

		return accum;
	}, output);

	// Ensure consistent padding
	output = output.trim();

	if (output !== '') {
		output = `\n${output}\n`;

		const errorCount = resultCounts.error;
		const warningCount = resultCounts.warning;
		const total = errorCount + warningCount;

		if (total > 0) {
			const error = styleText('red', `${errorCount} ${pluralize('error', errorCount)}`);
			const warning = styleText('yellow', `${warningCount} ${pluralize('warning', warningCount)}`);
			const symbol = formatSymbol(errorCount > 0 ? 'error' : 'warning', styleText);

			output += `\n${symbol} ${total} ${pluralize('problem', total)} (${error}, ${warning})`;
		}

		const fixErrorCount = fixableCounts.error;
		const fixWarningCount = fixableCounts.warning;

		if (fixErrorCount > 0 || fixWarningCount > 0) {
			let fixErrorText;
			let fixWarningText;

			if (fixErrorCount > 0) {
				fixErrorText = `${fixErrorCount} ${pluralize('error', fixErrorCount)}`;
			}

			if (fixWarningCount > 0) {
				fixWarningText = `${fixWarningCount} ${pluralize('warning', fixWarningCount)}`;
			}

			const countText = [fixErrorText, fixWarningText].filter(Boolean).join(' and ');

			output += `\n  ${countText} potentially fixable with the "--fix" option.`;
		}

		output += '\n\n';
	}

	return output;
}
