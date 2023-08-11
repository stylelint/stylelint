import compactFormatter from '../compactFormatter.mjs';
import prepareFormatterOutput from './prepareFormatterOutput.mjs';

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
				warnings: [],
			},
		];

		const output = compactFormatter(results);

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

		const output = prepareFormatterOutput(results, compactFormatter);

		expect(output).toBe('path/to/file.css: line 1, col 1, error - Unexpected foo');
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

		const output = prepareFormatterOutput(results, compactFormatter);

		expect(output).toBe('path/to/file.css: line 1, col 1, error - Unexpected foo');
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

		const output = prepareFormatterOutput(results, compactFormatter);

		expect(output).toBe(
			'path/to/file.css: line 1, col 1, error - Unexpected very very very very very very very very very very very very very long foo',
		);
	});

	it('handles ignored file', () => {
		const results = [
			{
				source: 'file.css',
				warnings: [],
				ignored: true,
			},
		];

		const output = prepareFormatterOutput(results, compactFormatter);

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
						stylelintType: 'foo-error',
						text: 'Cannot parse foo',
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

		const output = prepareFormatterOutput(results, compactFormatter);

		expect(output).toBe(`path/to/file.css: line 1, col 1, error - Cannot parse foo (foo-error)
path/to/file.css: line 2, col 1, error - Anonymous error
path/to/file.css: line 3, col 2, error - Unexpected foo`);
	});
});
