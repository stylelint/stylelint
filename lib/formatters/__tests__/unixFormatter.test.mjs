import process from 'node:process';

import { stripIndent } from 'common-tags';

import { getCleanFormatterOutput } from '../../testUtils/getCleanOutput.mjs';
import unixFormatter from '../unixFormatter.mjs';

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
						severity: 'warning',
						text: 'Unexpected foo 2',
					},
				],
			},
		];

		const output = getCleanFormatterOutput(results, unixFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css:1:1: Unexpected foo [error]
path/to/file.css:10:1: Unexpected foo 2 [warning]

2 problems (1 error, 1 warning)`);
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

		const output = getCleanFormatterOutput(results, unixFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css:1:1: Unexpected foo [error]

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

		const output = getCleanFormatterOutput(results, unixFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css:1:1: Unexpected very very very very very very very very very very very very very long foo [error]

1 problem (1 error, 0 warnings)`);
	});

	it('handles ignored file', () => {
		const results = [
			{
				source: 'file.css',
				warnings: [],
				ignored: true,
			},
		];

		const output = getCleanFormatterOutput(results, unixFormatter);

		expect(output).toBe('');
	});

	it('outputs parse errors and warnings without rule and severity', () => {
		const results = [
			{
				source: 'path/to/file.css',
				parseErrors: [
					{
						line: 1,
						column: 1,
						stylelintType: 'parseError',
						text: 'Cannot parse selector',
					},
				],
				warnings: [
					{
						line: 2,
						column: 1,
						text: 'Anonymous error',
					},
				],
			},
		];

		const output = getCleanFormatterOutput(results, unixFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css:1:1: Cannot parse selector (parseError) [error]
path/to/file.css:2:1: Anonymous error [error]

2 problems (2 errors, 0 warnings)`);
	});
});
