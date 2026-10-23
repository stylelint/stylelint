import { after, before, describe, it } from 'node:test';
import process from 'node:process';

import compactFormatter from '../compactFormatter.mjs';

describe('compactFormatter', () => {
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
				warnings: [],
			},
		];

		const output = compactFormatter(results);

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
				],
			},
		];

		const output = compactFormatter(results);

		t.assert.strictEqual(output, 'path/to/file.css: line 1, col 1, error - Unexpected foo\n');
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

		const output = compactFormatter(results);

		t.assert.strictEqual(output, 'path/to/file.css: line 1, col 1, error - Unexpected foo\n');
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

		const output = compactFormatter(results);

		t.assert.strictEqual(
			output,
			'path/to/file.css: line 1, col 1, error - Unexpected very very very very very very very very very very very very very long foo\n',
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

		const output = compactFormatter(results);

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
						line: 3,
						column: 2,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
					{
						line: 2,
						column: 1,
						text: 'Anonymous error',
					},
				],
			},
		];

		const output = compactFormatter(results);

		t.assert.strictEqual(
			output,
			`path/to/file.css: line 1, col 1, error - Cannot parse selector (parseError)
path/to/file.css: line 2, col 1, error - Anonymous error
path/to/file.css: line 3, col 2, error - Unexpected foo
`,
		);
	});
});
