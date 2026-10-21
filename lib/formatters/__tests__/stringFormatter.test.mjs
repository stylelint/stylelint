import { after, before, describe, it } from 'node:test';
import process from 'node:process';
import { stripVTControlCharacters } from 'node:util';

import { getCleanFormatterOutput } from '../../testUtils/getCleanOutput.mjs';
import isUnicodeSupported from '../../utils/isUnicodeSupported.mjs';
import stringFormatter from '../stringFormatter.mjs';
import stripIndent from '../../testUtils/stripIndent.mjs';

describe('stringFormatter', () => {
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

		const output = stringFormatter(results);

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

		const output = getCleanFormatterOutput(results, stringFormatter);

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css
  1:1  ×  Unexpected foo  bar

× 1 problem (1 error, 0 warnings)`,
		);
	});

	it('outputs symbols depending on the unicode support', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css
  1:1  ${errorSymbol}  Unexpected foo  bar

${errorSymbol} 1 problem (1 error, 0 warnings)`,
		);
	});

	it('outputs fixable error and warning counts', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
file.css
  1:2  ×  Unexpected foo  no-foo
  1:2  ×  Unexpected bar  no-bar
  1:2  ‼  Unexpected baz  no-baz

× 3 problems (2 errors, 1 warning)
  1 error and 1 warning potentially fixable with the "--fix" option.`,
		);
	});

	it('outputs fixable error counts', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
file.css
  1:2  ×  Unexpected foo  no-foo
  1:2  ×  Unexpected bar  no-bar

× 2 problems (2 errors, 0 warnings)
  1 error potentially fixable with the "--fix" option.`,
		);
	});

	it('outputs fixable warning counts', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
file.css
  1:2  ×  Unexpected foo  no-foo
  1:2  ‼  Unexpected bar  no-bar

× 2 problems (1 error, 1 warning)
  1 warning potentially fixable with the "--fix" option.`,
		);
	});

	it('outputs fixable warning counts with invalid or missing ruleMetadata', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
file.css
  1:2  ×  Unexpected foo  no-foo
  1:2  ‼  Unexpected bar  no-bar
  1:2  ‼  Unexpected baz  no-baz

× 3 problems (1 error, 2 warnings)
  1 warning potentially fixable with the "--fix" option.`,
		);
	});

	it('outputs results with missing ruleMetadata object', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
file.css
  1:2  ×  Unexpected foo  no-foo
  1:2  ‼  Unexpected bar  no-bar

× 2 problems (1 error, 1 warning)`,
		);
	});

	it('outputs warnings using the appropriate icon', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css
  1:1  ‼  Unexpected foo  bar

‼ 1 problem (0 errors, 1 warning)`,
		);
	});

	it('outputs warnings for multiple sources', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file-a.css
  1:2  ×  Unexpected foo  no-foo

path/to/file-b.css
  1:2  ‼  Unexpected bar  no-bar

× 2 problems (1 error, 1 warning)`,
		);
	});

	it('outputs warnings contains non-ASCII characters', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css
  1:1  ×  简体中文こんにちは안녕하세요  bar

× 1 problem (1 error, 0 warnings)`,
		);
	});

	it('removes rule name from warning text', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css
  1:1  ‼  Unexpected foo  rule-name

‼ 1 problem (0 errors, 1 warning)`,
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

		const output = getCleanFormatterOutput(results, stringFormatter);

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css
  1:1  ×  Unexpected foo  bar

× 1 problem (1 error, 0 warnings)`,
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

		const output = getCleanFormatterOutput(results, stringFormatter);

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css
  1:1  ×  Unexpected very very very very very very very  bar-very-very-very-very-very-long
          very very very very very very long foo

× 1 problem (1 error, 0 warnings)`,
		);
	});

	it('outputs warnings with more than 80 characters (no wordbreaks) and `process.stdout.columns` equal 90 characters', (t) => {
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

		t.assert.strictEqual(longestLine.length, columns);

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css
  1:1  ×  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa  bar-very-very-very-very-very-long
          aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
          aaaaaaaaaa

× 1 problem (1 error, 0 warnings)`,
		);
	});

	it('outputs warnings with more than 80 non-ASCII characters and `process.stdout.columns` equal 90 characters', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css
  1:1  ×  简体中文こんにちは안녕하세요简体中文こんにち   bar-very-very-very-very-very-long
          は안녕하세요简体中文こんにちは안녕하세요简体
          中文こんにちは안녕하세요简体中文こんにちは안
          녕하세요简体中文こんにちは안녕하세요简体中文
          こんにちは안녕하세요简体中文こんにちは안녕하
          세요简体中文こんにちは안녕하세요

× 1 problem (1 error, 0 warnings)`,
		);
	});

	it('condenses deprecations and invalid option warnings', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
Invalid Option: Unexpected option for baz

Deprecation warnings:
 - Deprecated foo. See: bar`,
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

		const output = getCleanFormatterOutput(results, stringFormatter);

		t.assert.strictEqual(output, '');
	});

	it('handles empty messages', (t) => {
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

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css
  1:1  ×     bar

× 1 problem (1 error, 0 warnings)`,
		);
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

		t.assert.strictEqual(
			output,
			stripIndent`
path/to/file.css
  1:1  ×  Cannot parse selector  parseError
  2:1  ×  Anonymous error
  3:1  ×  Disallow bar           no-bar

× 3 problems (3 errors, 0 warnings)`,
		);
	});

	it('outputs color depending on the `color` option', (t) => {
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

		t.assert.ok(stringFormatter(results, { ruleMetadata: {}, color: true }).includes('\u001B['));
		t.assert.ok(!stringFormatter(results, { ruleMetadata: {}, color: false }).includes('\u001B['));
	});
});
