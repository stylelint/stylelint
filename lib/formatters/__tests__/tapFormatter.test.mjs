import process from 'node:process';

import tapFormatter from '../tapFormatter.mjs';

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
			},
		];

		const output = tapFormatter(results);

		expect(output).toBe(`TAP version 14
1..1
ok 1 - path/to/file.css
`);
	});

	it('outputs warnings', () => {
		const results = [
			{
				source: 'path/to/file1.css',
				errored: true,
				warnings: [
					{
						line: 2,
						column: 1,
						endLine: 3,
						endColumn: 3,
						rule: 'baz',
						severity: 'error',
						text: 'Unexpected bar',
					},
				],
			},
			{
				source: 'path/to/file2.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 1,
						endLine: 2,
						endColumn: 3,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
					{
						line: 4,
						column: 1,
						endLine: 5,
						endColumn: 3,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
					{
						line: 10,
						column: 1,
						endLine: 11,
						endColumn: 2,
						rule: 'bar2',
						severity: 'error',
						text: 'Unexpected foo 2',
					},
				],
			},
		];

		const output = tapFormatter(results);

		expect(output).toBe(`TAP version 14
1..2
not ok 1 - path/to/file1.css
  ---
  baz:
    - message: "Unexpected bar"
      severity: error
      line: 2
      column: 1
      endLine: 3
      endColumn: 3
  ...
not ok 2 - path/to/file2.css
  ---
  bar:
    - message: "Unexpected foo"
      severity: error
      line: 1
      column: 1
      endLine: 2
      endColumn: 3
    - message: "Unexpected foo"
      severity: error
      line: 4
      column: 1
      endLine: 5
      endColumn: 3
  bar2:
    - message: "Unexpected foo 2"
      severity: error
      line: 10
      column: 1
      endLine: 11
      endColumn: 2
  ...
`);
	});

	it('handles escaping', () => {
		const results = [
			{
				source: 'path/to/file1.css',
				errored: true,
				warnings: [
					{
						line: 2,
						column: 1,
						endLine: 3,
						endColumn: 3,
						rule: 'baz',
						severity: 'error',
						text: '"a":"1"',
					},
				],
			},
			{
				source: 'octothorp/%23/file2.css#qux',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 1,
						endLine: 2,
						endColumn: 3,
						rule: 'bar',
						severity: 'error',
						text: 'message',
					},
				],
			},
			{
				source: 'backslash/file3.css\\#qux',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 1,
						endLine: 2,
						endColumn: 3,
						rule: 'bar',
						severity: 'error',
						text: 'message',
					},
				],
			},
			{
				source: 'number/file4.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 1,
						endLine: 2,
						endColumn: 3,
						rule: 'bar',
						severity: 'error',
						text: '1',
					},
				],
			},
		];

		const output = tapFormatter(results);

		expect(output).toBe(`TAP version 14
1..4
not ok 1 - path/to/file1.css
  ---
  baz:
    - message: "\\"a\\":\\"1\\""
      severity: error
      line: 2
      column: 1
      endLine: 3
      endColumn: 3
  ...
not ok 2 - octothorp/%23/file2.css\\#qux
  ---
  bar:
    - message: "message"
      severity: error
      line: 1
      column: 1
      endLine: 2
      endColumn: 3
  ...
not ok 3 - backslash/file3.css\\\\\\#qux
  ---
  bar:
    - message: "message"
      severity: error
      line: 1
      column: 1
      endLine: 2
      endColumn: 3
  ...
not ok 4 - number/file4.css
  ---
  bar:
    - message: "1"
      severity: error
      line: 1
      column: 1
      endLine: 2
      endColumn: 3
  ...
`);
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
						endLine: 2,
						endColumn: 3,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
			},
		];

		const output = tapFormatter(results);

		expect(output).toBe(`TAP version 14
1..1
not ok 1 - path/to/file.css
  ---
  bar:
    - message: "Unexpected foo"
      severity: error
      line: 1
      column: 1
      endLine: 2
      endColumn: 3
  ...
`);
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
						endLine: 2,
						endColumn: 3,
						rule: 'bar-very-very-very-very-very-long',
						severity: 'error',
						text: 'Unexpected very very very very very very very very very very very very very long foo',
					},
				],
			},
		];

		const output = tapFormatter(results);

		expect(output).toBe(`TAP version 14
1..1
not ok 1 - path/to/file.css
  ---
  bar-very-very-very-very-very-long:
    - message: "Unexpected very very very very very very very very very very very very very long foo"
      severity: error
      line: 1
      column: 1
      endLine: 2
      endColumn: 3
  ...
`);
	});

	it('handles ignored file', () => {
		const results = [
			{
				source: 'file.css',
				warnings: [],
				ignored: true,
			},
		];

		const output = tapFormatter(results);

		expect(output).toBe(`TAP version 14
1..${results.length}
ok 1 - ${results[0].source} # SKIP ignored
`);
	});

	it('outputs parse errors and warnings without rule and severity', () => {
		const results = [
			{
				source: 'path/to/file.css',
				errored: true,
				warnings: [
					{
						line: 2,
						column: 1,
						text: 'Unexpected foo',
					},
				],
				parseErrors: [
					{
						line: 1,
						column: 1,
						stylelintType: 'parseError',
						text: 'Cannot parse selector',
					},
				],
			},
		];

		const output = tapFormatter(results);

		expect(output).toBe(`TAP version 14
1..1
not ok 1 - path/to/file.css
  ---
  parseError:
    - message: "Cannot parse selector (parseError)"
      severity: error
      line: 1
      column: 1
  unknown:
    - message: "Unexpected foo"
      severity: error
      line: 2
      column: 1
  ...
`);
	});
});
