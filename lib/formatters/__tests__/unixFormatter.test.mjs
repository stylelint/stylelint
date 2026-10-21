import { after, before, describe, it } from 'node:test';
import process from 'node:process';

import { getCleanFormatterOutput } from '../../testUtils/getCleanOutput.mjs';
import stripIndent from '../../testUtils/stripIndent.mjs';
import unixFormatter from '../unixFormatter.mjs';

describe('unixFormatter', () => {
	let actualTTY;
	let actualColumns;

	before(() => {
		actualTTY = process.stdout.isTTY;
		actualColumns = process.stdout.columns;
	});

	after(() => {
		process.stdout.isTTY = actualTTY;
		process.stdout.columns = actualColumns;
	});

	it('outputs no warnings', (t) => {
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

		t.assert.strictEqual(output, '');
	});

	it('outputs warnings', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css:1:1: Unexpected foo [error]
path/to/file.css:10:1: Unexpected foo 2 [warning]

2 problems (1 error, 1 warning)`,
		);
	});

	it('outputs warnings without stdout `TTY`', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css:1:1: Unexpected foo [error]

1 problem (1 error, 0 warnings)`,
		);
	});

	it('outputs warnings with more than 80 characters and `process.stdout.columns` equal 90 characters', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css:1:1: Unexpected very very very very very very very very very very very very very long foo [error]

1 problem (1 error, 0 warnings)`,
		);
	});

	it('handles ignored file', (t) => {
		const results = [
			{
				source: 'file.css',
				warnings: [],
				ignored: true,
			},
		];

		const output = getCleanFormatterOutput(results, unixFormatter);

		t.assert.strictEqual(output, '');
	});

	it('outputs parse errors and warnings without rule and severity', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css:1:1: Cannot parse selector (parseError) [error]
path/to/file.css:2:1: Anonymous error [error]

2 problems (2 errors, 0 warnings)`,
		);
	});
});
