'use strict';

const prepareFormatterOutput = require('./prepareFormatterOutput');
const stripIndent = require('common-tags').stripIndent;
const verboseFormatter = require('../verboseFormatter');

describe('stringFormatter', () => {
	it('outputs no warnings', () => {
		const results = [
			{
				source: 'path/to/file.css',
				errored: false,
				warnings: [],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = prepareFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
      1 source checked
       path/to/file.css

      0 problems found
    `);
	});

	it("outputs one warnings (of severity 'error')", () => {
		const results = [
			{
				source: 'path/to/file.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 2,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = prepareFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
      path/to/file.css
       1:2  ×  Unexpected foo  bar

      1 source checked
       path/to/file.css

      1 problem found
       severity level "error": 1
        bar: 1
      `);
	});

	it('outputs 0 stdout column', () => {
		const stdoutColumn = process.stdout.columns;

		process.stdout.columns = 0;

		const results = [
			{
				source: 'path/to/file.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 2,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = prepareFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
      path/to/file.css
       1:2  ×  Unexpected foo  bar

      1 source checked
       path/to/file.css

      1 problem found
       severity level "error": 1
        bar: 1
      `);

		process.stdout.columns = stdoutColumn;
	});

	it('outputs less than 80 stdout column', () => {
		const stdoutColumn = process.stdout.columns;

		process.stdout.columns = 79;

		const results = [
			{
				source: 'path/to/file.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 2,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = prepareFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
      path/to/file.css
       1:2  ×  Unexpected foo  bar

      1 source checked
       path/to/file.css

      1 problem found
       severity level "error": 1
        bar: 1
      `);

		process.stdout.columns = stdoutColumn;
	});

	it("outputs two of the same warnings of 'error' and one of 'warning' across two files", () => {
		const results = [
			{
				source: 'path/to/file.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 2,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
					{
						line: 2,
						column: 3,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
			{
				source: 'file2.css',
				errored: true,
				warnings: [
					{
						line: 3,
						column: 1,
						rule: 'baz',
						severity: 'warning',
						text: 'Expected cat',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = prepareFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
      path/to/file.css
       1:2  ×  Unexpected foo  bar
       2:3  ×  Unexpected foo  bar

      file2.css
       3:1  ‼  Expected cat  baz

      2 sources checked
       path/to/file.css
       file2.css

      3 problems found
       severity level "error": 2
        bar: 2
       severity level "warning": 1
        baz: 1
    `);
	});

	it('outputs lineless syntax error', () => {
		const results = [
			{
				source: 'path/to/file.css',
				errored: false,
				warnings: [
					{
						rule: 'SyntaxError',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = prepareFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
      path/to/file.css
            ×  Unexpected foo  SyntaxError

      1 source checked
       path/to/file.css

      1 problem found
       severity level "error": 1
        SyntaxError: 1
      `);
	});

	it('outputs one ignored file', () => {
		const results = [
			{
				source: 'file.css',
				warnings: [],
				deprecations: [],
				invalidOptionWarnings: [],
				ignored: true,
			},
		];

		const output = prepareFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
      0 of 1 source checked
       file.css (ignored)

      0 problems found
      `);
	});
});
