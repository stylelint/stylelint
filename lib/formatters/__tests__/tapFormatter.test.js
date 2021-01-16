'use strict';

const prepareFormatterOutput = require('./prepareFormatterOutput');
const tapFormatter = require('../tapFormatter');

describe('tapFormatter', () => {
	let actualTTY;
	let actualColumns;

	beforeAll(() => {
		actualTTY = process.stdout.isTTY;
		actualColumns = process.stdout.columns;
	});

	afterAll(() => {
		process.stdout.isTTY = actualTTY;
		process.stdout.columns = actualColumns;
	});

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

		const output = tapFormatter(results);

		expect(output).toBe(
			`
TAP version 13
1..1
ok 1 - path/to/file.css
`.trimStart(),
		);
	});

	it('outputs warnings', () => {
		const results = [
			{
				source: 'path/to/file.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 1,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
					{
						line: 10,
						column: 1,
						rule: 'bar2',
						severity: 'error',
						text: 'Unexpected foo 2',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = prepareFormatterOutput(results, tapFormatter);

		expect(output).toBe(
			`
TAP version 13
1..1
not ok 1 - path/to/file.css
---
messages:
 - message: "Unexpected foo"
   severity: error
   data:
     line: 1
     column: 1
     ruleId: bar
 - message: "Unexpected foo 2"
   severity: error
   data:
     line: 10
     column: 1
     ruleId: bar2
---
`.trim(),
		);
	});

	it('outputs warnings without stdout `TTY`', () => {
		process.stdout.isTTY = false;

		const results = [
			{
				source: 'path/to/file.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 1,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = prepareFormatterOutput(results, tapFormatter);

		expect(output).toBe(
			`
TAP version 13
1..1
not ok 1 - path/to/file.css
---
messages:
 - message: "Unexpected foo"
   severity: error
   data:
     line: 1
     column: 1
     ruleId: bar
---
`.trim(),
		);
	});

	it('output warnings with more than 80 characters and `process.stdout.columns` equal 90 characters', () => {
		// For Windows tests
		process.stdout.isTTY = true;
		process.stdout.columns = 90;

		const results = [
			{
				source: 'path/to/file.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 1,
						rule: 'bar-very-very-very-very-very-long',
						severity: 'error',
						text:
							'Unexpected very very very very very very very very very very very very very long foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = prepareFormatterOutput(results, tapFormatter);

		expect(output).toBe(
			`
TAP version 13
1..1
not ok 1 - path/to/file.css
---
messages:
 - message: "Unexpected very very very very very very very very very very very very very long foo"
   severity: error
   data:
     line: 1
     column: 1
     ruleId: bar-very-very-very-very-very-long
---
`.trim(),
		);
	});

	it('handles ignored file', () => {
		const results = [
			{
				source: 'file.css',
				warnings: [],
				deprecations: [],
				invalidOptionWarnings: [],
				ignored: true,
			},
		];

		const output = prepareFormatterOutput(results, tapFormatter);

		expect(output).toBe(
			`
TAP version 13
1..${results.length}
ok 1 - ignored ${results[0].source}
`.trim(),
		);
	});
});
