import process from 'node:process';

import { stripIndent } from 'common-tags';

import { getCleanFormatterOutput } from '../../testUtils/getCleanOutput.mjs';
import verboseFormatter from '../verboseFormatter.mjs';

describe('verboseFormatter', () => {
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

		const output = getCleanFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
			1 source checked
			  path/to/file.css

			0 problems found`);
	});

	it("outputs one warnings (of severity 'error')", () => {
		const results = [
			{
				source: 'path/to/file.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 2,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = getCleanFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
			path/to/file.css
			  1:2  ×  Unexpected foo  bar

			× 1 problem (1 error, 0 warnings)

			1 source checked
			  path/to/file.css

			1 error found
			  bar: 1`);
	});

	it('outputs 0 stdout column', () => {
		const stdoutColumn = process.stdout.columns;

		process.stdout.columns = 0;

		const results = [
			{
				source: 'path/to/file.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 2,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = getCleanFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
			path/to/file.css
			  1:2  ×  Unexpected foo  bar

			× 1 problem (1 error, 0 warnings)

			1 source checked
			  path/to/file.css

			1 error found
			  bar: 1`);

		process.stdout.columns = stdoutColumn;
	});

	it('outputs less than 80 stdout column', () => {
		const stdoutColumn = process.stdout.columns;

		process.stdout.columns = 79;

		const results = [
			{
				source: 'path/to/file.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 2,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = getCleanFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
			path/to/file.css
			  1:2  ×  Unexpected foo  bar

			× 1 problem (1 error, 0 warnings)

			1 source checked
			  path/to/file.css

			1 error found
			  bar: 1`);

		process.stdout.columns = stdoutColumn;
	});

	it("outputs two of the same warnings of 'error' and one of 'warning' across two files", () => {
		const results = [
			{
				source: 'path/to/file.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 2,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
					{
						line: 2,
						column: 3,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
			{
				source: 'file2.css',
				errored: true,
				warnings: [
					{
						line: 3,
						column: 1,
						rule: 'baz',
						severity: 'warning',
						text: 'Expected cat',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = getCleanFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
			path/to/file.css
			  1:2  ×  Unexpected foo  bar
			  2:3  ×  Unexpected foo  bar

			file2.css
			  3:1  ‼  Expected cat  baz

			× 3 problems (2 errors, 1 warning)

			2 sources checked
			  path/to/file.css
			  file2.css

			2 errors found
			  bar: 2

			1 warning found
			  baz: 1`);
	});

	it('outputs lineless syntax error', () => {
		const results = [
			{
				source: 'path/to/file.css',
				errored: false,
				warnings: [
					{
						rule: 'SyntaxError',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = getCleanFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
			path/to/file.css
			       ×  Unexpected foo  SyntaxError

			× 1 problem (1 error, 0 warnings)

			1 source checked
			  path/to/file.css

			1 error found
			  SyntaxError: 1`);
	});

	it('outputs one ignored file', () => {
		const results = [
			{
				source: 'file.css',
				warnings: [],
				deprecations: [],
				invalidOptionWarnings: [],
				ignored: true,
			},
		];

		const output = getCleanFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
			0 of 1 source checked
			  file.css (ignored)

			0 problems found`);
	});

	it('outputs input CSS', () => {
		const results = [
			{
				source: '<input css>',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 2,
						rule: 'bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = getCleanFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
			<input css>
			  1:2  ×  Unexpected foo  bar

			× 1 problem (1 error, 0 warnings)

			1 source checked
			  <input css>

			1 error found
			  bar: 1`);
	});

	it('outputs plugin rule warnings', () => {
		const results = [
			{
				source: 'file.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 2,
						rule: 'plugin/bar',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];

		const output = getCleanFormatterOutput(results, verboseFormatter);

		expect(output).toBe(stripIndent`
			file.css
			  1:2  ×  Unexpected foo  plugin/bar

			× 1 problem (1 error, 0 warnings)

			1 source checked
			  file.css

			1 error found
			  plugin/bar: 1`);
	});

	it('outputs rule warnings with metadata', () => {
		const results = [
			{
				source: 'file.css',
				errored: true,
				warnings: [
					{
						line: 1,
						column: 2,
						rule: 'no-foo',
						severity: 'error',
						text: 'Unexpected foo',
					},
					{
						line: 1,
						column: 2,
						rule: 'no-bar',
						severity: 'error',
						text: 'Unexpected bar',
					},
					{
						line: 1,
						column: 2,
						rule: 'no-baz',
						severity: 'error',
						text: 'Unexpected baz',
					},
				],
				deprecations: [],
				invalidOptionWarnings: [],
			},
		];
		const returnValue = {
			ruleMetadata: {
				'no-foo': { url: 'https://stylelint.io', fixable: true, deprecated: true },
				'no-bar': { url: 'https://stylelint.io', fixable: true },
				'no-baz': { url: 'https://stylelint.io', deprecated: true },
			},
		};

		const output = getCleanFormatterOutput(results, verboseFormatter, returnValue);

		expect(output).toBe(stripIndent`
			file.css
			  1:2  ×  Unexpected foo  no-foo
			  1:2  ×  Unexpected bar  no-bar
			  1:2  ×  Unexpected baz  no-baz

			× 3 problems (3 errors, 0 warnings)
			  2 errors potentially fixable with the "--fix" option.

			1 source checked
			  file.css

			3 errors found
			  no-foo: 1 (maybe fixable, deprecated)
			  no-bar: 1 (maybe fixable)
			  no-baz: 1 (deprecated)`);
	});
});
