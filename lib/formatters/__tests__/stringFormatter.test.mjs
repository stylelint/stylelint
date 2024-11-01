import process from 'node:process';
import { stripVTControlCharacters } from 'node:util';

import { stripIndent } from 'common-tags';

import { getCleanFormatterOutput } from '../../testUtils/getCleanOutput.mjs';
import isUnicodeSupported from '../../utils/isUnicodeSupported.mjs';
import stringFormatter from '../stringFormatter.mjs';

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

		const output = getCleanFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
  1:1  ×  Unexpected foo  bar

× 1 problem (1 error, 0 warnings)`);
	});

	it('outputs symbols depending on the unicode support', () => {
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

		const errorSymbol = isUnicodeSupported() ? '✖' : '×';
		const output = stripVTControlCharacters(stringFormatter(results, { ruleMetadata: {} })).trim();

		expect(output).toBe(stripIndent`
path/to/file.css
  1:1  ${errorSymbol}  Unexpected foo  bar

${errorSymbol} 1 problem (1 error, 0 warnings)`);
	});

	it('outputs fixable error and warning counts', () => {
		const results = [
			{
				source: 'file.css',

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
						severity: 'warning',
						text: 'Unexpected baz',
					},
				],
			},
		];

		const returnValue = {
			ruleMetadata: {
				'no-foo': { fixable: true },
				'no-bar': { fixable: false },
				'no-baz': { fixable: true },
			},
		};

		const output = getCleanFormatterOutput(results, stringFormatter, returnValue);

		expect(output).toBe(stripIndent`
file.css
  1:2  ×  Unexpected foo  no-foo
  1:2  ×  Unexpected bar  no-bar
  1:2  ‼  Unexpected baz  no-baz

× 3 problems (2 errors, 1 warning)
  1 error and 1 warning potentially fixable with the "--fix" option.`);
	});

	it('outputs fixable error counts', () => {
		const results = [
			{
				source: 'file.css',

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
				],
			},
		];

		const returnValue = {
			ruleMetadata: {
				'no-foo': { fixable: true },
			},
		};

		const output = getCleanFormatterOutput(results, stringFormatter, returnValue);

		expect(output).toBe(stripIndent`
file.css
  1:2  ×  Unexpected foo  no-foo
  1:2  ×  Unexpected bar  no-bar

× 2 problems (2 errors, 0 warnings)
  1 error potentially fixable with the "--fix" option.`);
	});

	it('outputs fixable warning counts', () => {
		const results = [
			{
				source: 'file.css',

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
						severity: 'warning',
						text: 'Unexpected bar',
					},
				],
			},
		];

		const returnValue = {
			ruleMetadata: {
				'no-bar': { fixable: true },
			},
		};

		const output = getCleanFormatterOutput(results, stringFormatter, returnValue);

		expect(output).toBe(stripIndent`
file.css
  1:2  ×  Unexpected foo  no-foo
  1:2  ‼  Unexpected bar  no-bar

× 2 problems (1 error, 1 warning)
  1 warning potentially fixable with the "--fix" option.`);
	});

	it('outputs fixable warning counts with invalid or missing ruleMetadata', () => {
		const results = [
			{
				source: 'file.css',

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
						severity: 'warning',
						text: 'Unexpected bar',
					},
					{
						line: 1,
						column: 2,
						rule: 'no-baz',
						severity: 'warning',
						text: 'Unexpected baz',
					},
				],
			},
		];

		const returnValue = {
			ruleMetadata: {
				'no-foo': {}, // fixable should exist
				'no-bar': { fixable: 900 }, // fixable should be a boolean
				'no-baz': { fixable: true },
			},
		};

		const output = getCleanFormatterOutput(results, stringFormatter, returnValue);

		expect(output).toBe(stripIndent`
file.css
  1:2  ×  Unexpected foo  no-foo
  1:2  ‼  Unexpected bar  no-bar
  1:2  ‼  Unexpected baz  no-baz

× 3 problems (1 error, 2 warnings)
  1 warning potentially fixable with the "--fix" option.`);
	});

	it('outputs results with missing ruleMetadata object', () => {
		const results = [
			{
				source: 'file.css',

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
						severity: 'warning',
						text: 'Unexpected bar',
					},
				],
			},
		];

		const returnValue = { ruleMetadata: null };

		const output = getCleanFormatterOutput(results, stringFormatter, returnValue);

		expect(output).toBe(stripIndent`
file.css
  1:2  ×  Unexpected foo  no-foo
  1:2  ‼  Unexpected bar  no-bar

× 2 problems (1 error, 1 warning)`);
	});

	it('outputs warnings using the appropriate icon', () => {
		const results = [
			{
				source: 'path/to/file.css',
				warnings: [
					{
						line: 1,
						column: 1,
						rule: 'bar',
						severity: 'warning',
						text: 'Unexpected foo',
					},
				],
			},
		];

		const output = getCleanFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
  1:1  ‼  Unexpected foo  bar

‼ 1 problem (0 errors, 1 warning)`);
	});

	it('outputs warnings for multiple sources', () => {
		const results = [
			{
				source: 'path/to/file-a.css',
				warnings: [
					{
						line: 1,
						column: 2,
						rule: 'no-foo',
						severity: 'error',
						text: 'Unexpected foo',
					},
				],
			},
			{
				source: 'path/to/file-b.css',
				warnings: [
					{
						line: 1,
						column: 2,
						rule: 'no-bar',
						severity: 'warning',
						text: 'Unexpected bar',
					},
				],
			},
		];

		const output = getCleanFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file-a.css
  1:2  ×  Unexpected foo  no-foo

path/to/file-b.css
  1:2  ‼  Unexpected bar  no-bar

× 2 problems (1 error, 1 warning)`);
	});

	it('outputs warnings contains non-ASCII characters', () => {
		const results = [
			{
				source: 'path/to/file.css',
				warnings: [
					{
						line: 1,
						column: 1,
						rule: 'bar',
						severity: 'error',
						text: '简体中文こんにちは안녕하세요',
					},
				],
			},
		];

		const output = getCleanFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
  1:1  ×  简体中文こんにちは안녕하세요  bar

× 1 problem (1 error, 0 warnings)`);
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

		const output = getCleanFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
  1:1  ‼  Unexpected foo  rule-name

‼ 1 problem (0 errors, 1 warning)`);
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

		const output = getCleanFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
  1:1  ×  Unexpected foo  bar

× 1 problem (1 error, 0 warnings)`);
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

		const output = getCleanFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
  1:1  ×  Unexpected very very very very very very very  bar-very-very-very-very-very-long
          very very very very very very long foo

× 1 problem (1 error, 0 warnings)`);
	});

	it('outputs warnings with more than 80 characters (no wordbreaks) and `process.stdout.columns` equal 90 characters', () => {
		const columns = 90;

		// For Windows tests
		process.stdout.isTTY = true;
		process.stdout.columns = columns;

		const results = [
			{
				source: 'path/to/file.css',
				warnings: [
					{
						line: 1,
						column: 1,
						rule: 'bar-very-very-very-very-very-long',
						severity: 'error',
						text: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
					},
				],
			},
		];

		const output = getCleanFormatterOutput(results, stringFormatter);

		const longestLine = output.split('\n')[1];

		expect(longestLine).toHaveLength(columns);

		expect(output).toBe(stripIndent`
path/to/file.css
  1:1  ×  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa  bar-very-very-very-very-very-long
          aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
          aaaaaaaaaa

× 1 problem (1 error, 0 warnings)`);
	});

	it('outputs warnings with more than 80 non-ASCII characters and `process.stdout.columns` equal 90 characters', () => {
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
						text:
							'简体中文こんにちは안녕하세요简体中文こんにちは안녕하세요简体中文こんにちは안녕하세요简体中文こんにちは안녕하세요简体中文' +
							'こんにちは안녕하세요简体中文こんにちは안녕하세요简体中文こんにちは안녕하세요简体中文こんにちは안녕하세요简体中文こんにちは안녕하세요',
					},
				],
			},
		];

		const output = getCleanFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
  1:1  ×  简体中文こんにちは안녕하세요简体中文こんにち   bar-very-very-very-very-very-long
          は안녕하세요简体中文こんにちは안녕하세요简体
          中文こんにちは안녕하세요简体中文こんにちは안
          녕하세요简体中文こんにちは안녕하세요简体中文
          こんにちは안녕하세요简体中文こんにちは안녕하
          세요简体中文こんにちは안녕하세요

× 1 problem (1 error, 0 warnings)`);
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

		const output = getCleanFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
Invalid Option: Unexpected option for baz

Deprecation warnings:
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

		const output = getCleanFormatterOutput(results, stringFormatter);

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

		const output = getCleanFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
  1:1  ×     bar

× 1 problem (1 error, 0 warnings)`);
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

		const output = getCleanFormatterOutput(results, stringFormatter);

		expect(output).toBe(stripIndent`
path/to/file.css
  1:1  ×  Cannot parse selector  parseError
  2:1  ×  Anonymous error
  3:1  ×  Disallow bar           no-bar

× 3 problems (3 errors, 0 warnings)`);
	});
});
