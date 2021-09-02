'use strict';

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
				errored: false,
				warnings: [],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = stringFormatter(results);

		expect(output).toBe('');
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
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe(
			`
path/to/file.css
 1:1  ×  Unexpected foo  bar`.trimStart(),
		);
	});

	it('removes rule name from warning text', () => {
		const results = [
			{
				source: 'path/to/file.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 1,
						rule: 'rule-name',
						severity: 'error',
						text: 'Unexpected foo (rule-name)',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe(
			`
path/to/file.css
 1:1  ×  Unexpected foo  rule-name`.trimStart(),
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

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe(
			`
path/to/file.css
 1:1  ×  Unexpected foo  bar`.trimStart(),
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
						text: 'Unexpected very very very very very very very very very very very very very long foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe(
			`
path/to/file.css
 1:1  ×  Unexpected very very very very very very very  bar-very-very-very-very-very-long
         very very very very very very long foo`.trimStart(),
		);
	});

	it('condenses deprecations and invalid option warnings', () => {
		const results = [
			{
				source: 'file.css',
				deprecations: [
					{
						text: 'Deprecated foo',
						reference: 'bar',
					},
				],
				invalidOptionWarnings: [
					{
						text: 'Unexpected option for baz',
					},
				],
				errored: true,
				warnings: [],
			},
			{
				source: 'file2.css',
				deprecations: [
					{
						text: 'Deprecated foo',
						reference: 'bar',
					},
				],
				invalidOptionWarnings: [
					{
						text: 'Unexpected option for baz',
					},
				],
				errored: true,
				warnings: [],
			},
		];

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe(
			`
Invalid Option: Unexpected option for baz

Deprecation Warning: Deprecated foo See: bar`.trimStart(),
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

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe('');
	});

	it('handles empty messages', () => {
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
						text: '',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = prepareFormatterOutput(results, stringFormatter);

		expect(output).toBe(
			`
path/to/file.css
 1:1  ×     bar`.trimStart(),
		);
	});
});
