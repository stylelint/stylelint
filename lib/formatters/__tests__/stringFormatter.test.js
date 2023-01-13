'use strict';

const { stripIndent } = require('common-tags');

const prepareFormatterOutput = require('./prepareFormatterOutput');
const stringFormatter = require('../stringFormatter');

describe('stringFormatter', () => {
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
				warnings: [],
			},
		];

		const output = stringFormatter(results);

		expect(output).toBe('');
	});

	it('outputs warnings', () => {
		const results = [
			{
				source: 'path/to/file.css',
				warnings: [
					{
						line: 1,
						column: 1,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
			},
		];

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
 1:1  ×  Unexpected foo  bar

1 problem (1 error, 0 warnings)`);
	});

	it('removes rule name from warning text', () => {
		const results = [
			{
				source: 'path/to/file.css',
				warnings: [
					{
						line: 1,
						column: 1,
						rule: 'rule-name',
						severity: 'warning',
						text: 'Unexpected foo (rule-name)',
					},
				],
			},
		];

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
 1:1  ‼  Unexpected foo  rule-name

1 problem (0 errors, 1 warning)`);
	});

	it('outputs warnings without stdout `TTY`', () => {
		process.stdout.isTTY = false;

		const results = [
			{
				source: 'path/to/file.css',
				warnings: [
					{
						line: 1,
						column: 1,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
			},
		];

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
 1:1  ×  Unexpected foo  bar

1 problem (1 error, 0 warnings)`);
	});

	it('outputs warnings with more than 80 characters and `process.stdout.columns` equal 90 characters', () => {
		// For Windows tests
		process.stdout.isTTY = true;
		process.stdout.columns = 90;

		const results = [
			{
				source: 'path/to/file.css',
				warnings: [
					{
						line: 1,
						column: 1,
						rule: 'bar-very-very-very-very-very-long',
						severity: 'error',
						text: 'Unexpected very very very very very very very very very very very very very long foo',
					},
				],
			},
		];

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
 1:1  ×  Unexpected very very very very very very very  bar-very-very-very-very-very-long
         very very very very very very long foo

1 problem (1 error, 0 warnings)`);
	});

	it('condenses deprecations and invalid option warnings', () => {
		const results = [
			{
				source: 'file.css',
				deprecations: [
					{
						text: 'Deprecated foo.',
						reference: 'bar',
					},
				],
				invalidOptionWarnings: [
					{
						text: 'Unexpected option for baz',
					},
				],
				warnings: [],
			},
			{
				source: 'file2.css',
				deprecations: [
					{
						text: 'Deprecated foo.',
						reference: 'bar',
					},
				],
				invalidOptionWarnings: [
					{
						text: 'Unexpected option for baz',
					},
				],
				warnings: [],
			},
		];

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
Invalid Option: Unexpected option for baz

Deprecation Warning:
 - Deprecated foo. See: bar`);
	});

	it('handles ignored file', () => {
		const results = [
			{
				source: 'file.css',
				warnings: [],
				ignored: true,
			},
		];

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe('');
	});

	it('handles empty messages', () => {
		const results = [
			{
				source: 'path/to/file.css',
				warnings: [
					{
						line: 1,
						column: 1,
						rule: 'bar',
						severity: 'error',
						text: '',
					},
				],
			},
		];

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
 1:1  ×     bar

1 problem (1 error, 0 warnings)`);
	});

	it('outputs parse errors and warnings without rule and severity', () => {
		const results = [
			{
				source: 'path/to/file.css',
				parseErrors: [
					{
						line: 1,
						column: 1,
						stylelintType: 'foo-error',
						text: 'Cannot parse foo',
					},
				],
				warnings: [
					{
						line: 3,
						column: 1,
						rule: 'no-bar',
						severity: 'error',
						text: 'Disallow bar',
					},
					{
						line: 2,
						column: 1,
						text: 'Anonymous error',
					},
				],
			},
		];

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
 1:1  ×  Cannot parse foo  foo-error
 2:1  ×  Anonymous error
 3:1  ×  Disallow bar      no-bar

3 problems (3 errors, 0 warnings)`);
	});
});
