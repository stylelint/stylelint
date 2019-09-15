/* @flow */

'use strict';

const chalk = require('chalk');
const path = require('path');

function logFrom(fromValue /*: string */) /*: string */ {
	if (fromValue.charAt(0) === '<') return fromValue;

	return path
		.relative(process.cwd(), fromValue)
		.split(path.sep)
		.join('/');
}

module.exports = function(report /*:: ?: stylelint$disableOptionsReport */) /*: string */ {
	if (!report) return '';

	let output = '';

	report.forEach((sourceReport) => {
		if (!sourceReport.ranges || sourceReport.ranges.length === 0) {
			return;
		}

		output += '\n';
		output += chalk.underline(logFrom(sourceReport.source)) + '\n';
		sourceReport.ranges.forEach((range) => {
			output += `unused rule: ${range.unusedRule}, start line: ${range.start}`;

			if (range.end !== undefined) {
				output += `, end line: ${range.end}`;
			}

			output += '\n';
		});
	});

	return output;
};
