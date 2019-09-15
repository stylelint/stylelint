'use strict';

const prepareFormatterOutput = require('./prepareFormatterOutput');
const stripIndent = require('common-tags').stripIndent;
const unixFormatter = require('../unixFormatter');

describe('unixFormatter', () => {
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

		const output = unixFormatter(results);

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

		const output = prepareFormatterOutput(results, unixFormatter);

		expect(output).toBe(stripIndent`
      path/to/file.css:1:1: Unexpected foo [error]
      path/to/file.css:10:1: Unexpected foo 2 [error]

      2 problems
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

		const output = prepareFormatterOutput(results, unixFormatter);

		expect(output).toBe(stripIndent`
      path/to/file.css:1:1: Unexpected foo [error]

      1 problem
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

		const output = prepareFormatterOutput(results, unixFormatter);

		expect(output).toBe(stripIndent`
        path/to/file.css:1:1: Unexpected very very very very very very very very very very very very very long foo [error]

        1 problem
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

		const output = prepareFormatterOutput(results, unixFormatter);

		expect(output).toBe('');
	});
});
