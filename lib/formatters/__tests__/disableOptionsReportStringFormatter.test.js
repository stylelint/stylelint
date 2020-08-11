'use strict';

const disableOptionsReportStringFormatterTest = require('../disableOptionsReportStringFormatter');
const stripAnsi = require('strip-ansi');
const stripIndent = require('common-tags').stripIndent;

describe('disableOptionsReportStringFormatter', () => {
	it('formatter stringified', () => {
		const actual = stripAnsi(
			disableOptionsReportStringFormatterTest([
				{
					source: 'foo',
					ranges: [
						{ start: 1, end: 3, rule: 'baz' },
						{ start: 7, rule: 'all' },
					],
				},
				{
					source: 'bar',
					ranges: [
						{ start: 19, end: 33, rule: 'all' },
						{ start: 99, end: 102, rule: 'baz' },
					],
				},
				{
					sourc: 'baz',
					ranges: [],
				},
			]),
		);

		let expected = stripIndent`
      foo
      unused rule: baz, start line: 1, end line: 3
      unused rule: all, start line: 7

      bar
      unused rule: all, start line: 19, end line: 33
      unused rule: baz, start line: 99, end line: 102`;

		expected = `\n${expected}\n`;

		expect(actual).toBe(expected);
	});

	it('empty report', () => {
		const actual = stripAnsi(disableOptionsReportStringFormatterTest());

		expect(actual).toBe('');
	});
});
