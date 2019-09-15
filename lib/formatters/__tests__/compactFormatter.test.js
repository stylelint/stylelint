'use strict';

const compactFormatter = require('../compactFormatter');
const prepareFormatterOutput = require('./prepareFormatterOutput');
const stripIndent = require('common-tags').stripIndent;

describe('compactFormatter', () => {
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

		const output = compactFormatter(results);

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

		const output = prepareFormatterOutput(results, compactFormatter);

		expect(output).toBe(stripIndent`
      path/to/file.css: line 1, col 1, error - Unexpected foo
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
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = prepareFormatterOutput(results, compactFormatter);

		expect(output).toBe(stripIndent`
      path/to/file.css: line 1, col 1, error - Unexpected foo
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

		const output = prepareFormatterOutput(results, compactFormatter);

		expect(output).toBe(stripIndent`
        path/to/file.css: line 1, col 1, error - Unexpected very very very very very very very very very very very very very long foo
    `);
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

		const output = prepareFormatterOutput(results, compactFormatter);

		expect(output).toBe('');
	});
});
