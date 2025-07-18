/* eslint no-console: off */

import * as fs from 'node:fs/promises';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';
import { stripVTControlCharacters } from 'node:util';

import { jest } from '@jest/globals';
import { stripIndent } from 'common-tags';

import {
	EXIT_CODE_FATAL_ERROR,
	EXIT_CODE_INVALID_USAGE,
	EXIT_CODE_LINT_PROBLEM,
} from '../constants.mjs';
import readJSONFile from '../testUtils/readJSONFile.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';

import customFormatter from './fixtures/custom-formatter.mjs';

import cli, { buildCLI } from '../cli.mjs';

const pkg = readJSONFile(new URL('../../package.json', import.meta.url));

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

jest.unstable_mockModule('stylelint-test-custom-formatter', () => ({ default: customFormatter }));

describe('buildCLI', () => {
	it('flags - default', () => {
		expect(buildCLI([]).flags).toEqual({
			computeEditInfo: false,
			ignorePath: [],
			ignorePattern: [],
			validate: true,
		});
	});

	it('flags.allowEmptyInput', () => {
		expect(buildCLI(['--allow-empty-input']).flags.allowEmptyInput).toBe(true);
		expect(buildCLI(['--aei']).flags.allowEmptyInput).toBe(true);
	});

	it('flags.cache', () => {
		expect(buildCLI(['--cache']).flags.cache).toBe(true);
		expect(buildCLI(['--no-cache']).flags.cache).toBe(false);
	});

	it('flags.cacheLocation', () => {
		expect(buildCLI(['--cache-location=foo']).flags.cacheLocation).toBe('foo');
	});

	it('flags.globbyOptions', () => {
		expect(buildCLI(['--globby-options={"dot":true}']).flags.globbyOptions).toBe('{"dot":true}');
		expect(buildCLI(['--go={"dot":true}']).flags.globbyOptions).toBe('{"dot":true}');
	});

	it('flags.cacheStrategy', () => {
		expect(buildCLI(['--cache-strategy=content']).flags.cacheStrategy).toBe('content');
		expect(buildCLI(['--cache-strategy=metadata']).flags.cacheStrategy).toBe('metadata');
	});

	it('flags.color', () => {
		expect(buildCLI(['--color']).flags.color).toBe(true);
		expect(buildCLI(['--no-color']).flags.color).toBe(false);
	});

	it('flags.config', () => {
		expect(buildCLI(['--config=/path/to/file']).flags.config).toBe('/path/to/file');
		expect(buildCLI(['-c=/path/to/file']).flags.config).toBe('/path/to/file');
	});

	it('flags.configBasedir', () => {
		expect(buildCLI(['--config-basedir=/path/to/dir']).flags.configBasedir).toBe('/path/to/dir');
	});

	it('flags.customFormatter', () => {
		expect(buildCLI(['--custom-formatter=foo']).flags.customFormatter).toBe('foo');
	});

	it('flags.customSyntax', () => {
		expect(buildCLI(['--custom-syntax=foo']).flags.customSyntax).toBe('foo');
	});

	it('flags.disableDefaultIgnores', () => {
		expect(buildCLI(['--disable-default-ignores']).flags.disableDefaultIgnores).toBe(true);
		expect(buildCLI(['--di']).flags.disableDefaultIgnores).toBe(true);
	});

	it('flags.fix', () => {
		expect(buildCLI(['--fix']).flags.fix).toBe('');
		expect(buildCLI(['--fix=lax']).flags.fix).toBe('lax');
		expect(buildCLI(['--fix=strict']).flags.fix).toBe('strict');
		expect(buildCLI(['--fix=true']).flags.fix).toBe('true');
		expect(buildCLI(['--fix=false']).flags.fix).toBe('false');
		expect(buildCLI(['--fix=unknown']).flags.fix).toBe('unknown');
		expect(buildCLI(['--fix lax']).flags.fix).toBeUndefined();
		expect(buildCLI(['--fix strict']).flags.fix).toBeUndefined();
		expect(buildCLI(['--fix true']).flags.fix).toBeUndefined();
		expect(buildCLI(['--fix false']).flags.fix).toBeUndefined();
		expect(buildCLI(['--fix unknown']).flags.fix).toBeUndefined();
	});

	it('flags.validate', () => {
		expect(buildCLI(['--validate']).flags.validate).toBe(true);
		expect(buildCLI(['--no-validate']).flags.validate).toBe(false);
	});

	it('flags.formatter', () => {
		expect(buildCLI(['--formatter=json']).flags.formatter).toBe('json');
		expect(buildCLI(['-f', 'json']).flags.formatter).toBe('json');
	});

	it('flags.help', () => {
		expect(buildCLI(['--help']).flags.help).toBe(true);
		expect(buildCLI(['-h']).flags.help).toBe(true);
	});

	it('flags.ignoreDisables', () => {
		expect(buildCLI(['--ignore-disables']).flags.ignoreDisables).toBe(true);
		expect(buildCLI(['--id']).flags.ignoreDisables).toBe(true);
	});

	it('flags.ignorePath', () => {
		expect(buildCLI(['--ignore-path=/path/to/file']).flags.ignorePath).toEqual(['/path/to/file']);
		expect(buildCLI(['-i', '/path/to/file']).flags.ignorePath).toEqual(['/path/to/file']);
		expect(
			buildCLI(['--ignore-path=/path/to/file1', '--ignore-path=/path/to/file2']).flags.ignorePath,
		).toEqual(['/path/to/file1', '/path/to/file2']);
		expect(buildCLI(['-i', '/path/to/file1', '-i', '/path/to/file2']).flags.ignorePath).toEqual([
			'/path/to/file1',
			'/path/to/file2',
		]);
	});

	it('flags.ignorePattern', () => {
		expect(buildCLI(['--ignore-pattern=vendor/**']).flags.ignorePattern).toEqual(['vendor/**']);
		expect(buildCLI(['--ip', 'vendor/**']).flags.ignorePattern).toEqual(['vendor/**']);
		expect(buildCLI(['--ip', 'vendor/**', '--ip', 'test/*.css']).flags.ignorePattern).toEqual([
			'vendor/**',
			'test/*.css',
		]);
	});

	it('flags.maxWarnings', () => {
		expect(buildCLI(['--max-warnings=7']).flags.maxWarnings).toBe(7);
		expect(buildCLI(['--mw', '-1']).flags.maxWarnings).toBe(-1);
	});

	it('flags.outputFile', () => {
		expect(buildCLI(['--output-file=/path/to/file']).flags.outputFile).toBe('/path/to/file');
		expect(buildCLI(['-o', '/path/to/file']).flags.outputFile).toBe('/path/to/file');
	});

	it('flags.printConfig', () => {
		expect(buildCLI(['--print-config']).flags.printConfig).toBe(true);
	});

	it('flags.quiet', () => {
		expect(buildCLI(['--quiet']).flags.quiet).toBe(true);
		expect(buildCLI(['-q']).flags.quiet).toBe(true);
	});

	it('flags.quietDeprecationWarnings', () => {
		expect(buildCLI(['--quiet-deprecation-warnings']).flags.quietDeprecationWarnings).toBe(true);
	});

	it('flags.reportInvalidScopeDisables', () => {
		expect(buildCLI(['--report-invalid-scope-disables']).flags.reportInvalidScopeDisables).toBe(
			true,
		);
		expect(buildCLI(['--risd']).flags.reportInvalidScopeDisables).toBe(true);
	});

	it('flags.reportNeedlessDisables', () => {
		expect(buildCLI(['--report-needless-disables']).flags.reportNeedlessDisables).toBe(true);
		expect(buildCLI(['--rd']).flags.reportNeedlessDisables).toBe(true);
	});

	it('flags.stdin', () => {
		expect(buildCLI(['--stdin']).flags.stdin).toBe(true);
	});

	it('flags.stdinFilename', () => {
		expect(buildCLI(['--stdin-filename=foo.css']).flags.stdinFilename).toBe('foo.css');
	});

	it('flags.version', () => {
		expect(buildCLI(['--version']).flags.version).toBe(true);
		expect(buildCLI(['-v']).flags.version).toBe(true);
	});

	it('flags.computeEditInfo', () => {
		expect(buildCLI(['--compute-edit-info']).flags.computeEditInfo).toBe(true);
		expect(buildCLI(['--cei']).flags.computeEditInfo).toBe(true);
	});
});

describe('CLI', () => {
	beforeEach(() => {
		jest.spyOn(process, 'exit').mockImplementation(() => {});
		jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
		jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
		jest.spyOn(console, 'log').mockImplementation(() => {});
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
		process.exitCode = undefined;
	});

	const cssTmpDir = fixturesPath('tmp', 'cli');

	beforeEach(async () => {
		await fs.mkdir(cssTmpDir, { recursive: true });
	});

	afterEach(async () => {
		await fs.rm(cssTmpDir, { recursive: true });
	});

	it('no arguments', async () => {
		jest.spyOn(process, 'stdin', 'get').mockImplementationOnce(() => ({ isTTY: true }));

		await cli([]);

		expect(process.exit).toHaveBeenCalledWith(0);

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Usage: stylelint [input] [options]'),
		);
	});

	it('--help', async () => {
		await cli(['--help']);

		expect(process.exit).toHaveBeenCalledWith(0);

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log.mock.calls[0][0]).toMatchSnapshot();
	});

	it('--version', async () => {
		await cli(['--version']);

		expect(process.exit).toHaveBeenCalledWith(0);

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith(expect.stringContaining(pkg.version));
	});

	it('--print-config', async () => {
		await cli([
			'--print-config',
			'--config',
			fixturesPath('config-color-no-invalid-hex.json'),
			fixturesPath('invalid-hex.css'),
		]);

		expect(process.exitCode).toBeUndefined();

		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).toHaveBeenLastCalledWith(
			JSON.stringify(
				{
					rules: {
						'color-no-invalid-hex': [true],
					},
				},
				null,
				'  ',
			),
		);
	});

	it('--report-needless-disables', async () => {
		await cli([
			'--report-needless-disables',
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('empty-block-with-disables.css'),
		]);

		expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(
			expect.stringMatching(/Needless disable for "color-named".*Unexpected empty block/s),
		);
	});

	it('reports disallowed disables', async () => {
		await cli([
			'--config',
			fixturesPath('config-block-no-empty-report-disables.json'),
			fixturesPath('empty-block-with-relevant-disable.css'),
		]);

		expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(
			expect.stringContaining('Rule "block-no-empty" may not be disabled'),
		);
	});

	it('reports descriptionless disables', async () => {
		await cli([
			'--report-descriptionless-disables',
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('empty-block-with-relevant-disable.css'),
		]);

		expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(
			expect.stringContaining('Disable for "block-no-empty" is missing a description'),
		);
	});

	it('--stdin with any input from stdin', async () => {
		jest.spyOn(process, 'stdin', 'get').mockImplementationOnce(() => Readable.from([]));

		await cli(['--stdin', '--config', fixturesPath('config-no-empty-source.json')]);

		expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(
			expect.stringContaining('Unexpected empty source'),
		);
	});

	it('--stdin with no input from stdin', async () => {
		jest.spyOn(process, 'stdin', 'get').mockImplementationOnce(() => ({ isTTY: true }));

		await cli(['--stdin']);

		expect(process.exitCode).toBe(EXIT_CODE_FATAL_ERROR);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(
			expect.stringContaining('You must pass stylelint a `files` glob or a `code` string'),
		);
	});

	it('empty input from stdin without --stdin', async () => {
		jest.spyOn(process, 'stdin', 'get').mockImplementation(() => Readable.from([]));

		await cli(['--config', fixturesPath('config-no-empty-source.json')]);

		expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(expect.stringMatching('no-empty-source'));
	});

	// eslint-disable-next-line jest/no-disabled-tests -- TODO: This case fails on Node.js 18. Restore the case when dropping the support for Node.js 18.
	it.skip('exits with non zero on unfound module in config', async () => {
		await cli([
			'--config',
			fixturesPath('config-require-unknown.cjs'),
			fixturesPath('empty-block-with-disables.css'),
		]);

		expect(process.exitCode).toBe(EXIT_CODE_FATAL_ERROR);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(
			expect.stringContaining('Cannot find module'),
		);
	});

	it('outputs a valid JSON to stderr even if max warnings exceeded', async () => {
		await cli([
			'--formatter=json',
			'--max-warnings=0',
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(2);
		const output = JSON.parse(process.stderr.write.mock.calls[0][0]);

		expect(output).toBeInstanceOf(Array);
		expect(output[0]).toHaveProperty('source', expect.stringContaining('empty-block.css'));

		expect(stripVTControlCharacters(process.stderr.write.mock.calls[1][0])).toContain(
			'Max warnings exceeded: 1 found. 0 allowed',
		);
	});

	it('--quiet', async () => {
		await cli([
			'--quiet',
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		expect(process.exitCode).toBeUndefined();

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).not.toHaveBeenCalled();
	});

	it('--quiet-deprecation-warnings', async () => {
		await cli([
			'--quiet-deprecation-warnings',
			'--config',
			fixturesPath('quiet-deprecation-warnings/config.json'),
			fixturesPath('quiet-deprecation-warnings/style.css'),
		]);

		expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write.mock.calls[0][0]).toEqual(
			expect.not.stringContaining('The "color-hex-case" rule is deprecated.'),
		);
	});

	it('--custom-formatter with absolute path to ESM', async () => {
		await cli([
			'--custom-formatter',
			fixturesPath('custom-formatter.mjs'),
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(expect.stringContaining('deprecations: [],'));
	});

	it('--custom-formatter with absolute path to CommonJS', async () => {
		await cli([
			'--custom-formatter',
			fixturesPath('custom-formatter.cjs'),
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(expect.stringContaining('deprecations: [],'));
	});

	it('--custom-formatter with relative path to ESM', async () => {
		await cli([
			'--custom-formatter',
			path.relative(process.cwd(), fixturesPath('custom-formatter.mjs')),
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(expect.stringContaining('deprecations: [],'));
	});

	it('--custom-formatter with relative path to CommonJS', async () => {
		await cli([
			'--custom-formatter',
			path.relative(process.cwd(), fixturesPath('custom-formatter.cjs')),
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(expect.stringContaining('deprecations: [],'));
	});

	it('--custom-formatter with node module', async () => {
		await cli([
			'--custom-formatter=stylelint-test-custom-formatter',
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(expect.stringContaining('deprecations: [],'));
	});

	it('output a message when wrong --globby-options provided', async () => {
		await cli(['--globby-options=wrong']);

		expect(process.exitCode).toBe(EXIT_CODE_INVALID_USAGE);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(stripVTControlCharacters(process.stderr.write.mock.calls[0][0])).toContain(
			'Invalid option "--globby-options". The value "wrong" is not valid JSON object.',
		);
	});

	it('--globby-options', async () => {
		await cli([
			'--globby-options={"dot":true}',
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('globby-options'),
		]);

		expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(expect.stringMatching(/block-no-empty/));
	});

	it('--custom-syntax', async () => {
		await cli([
			'--custom-syntax=postcss-scss',
			'--config',
			fixturesPath('config-color-no-invalid-hex.json'),
			fixturesPath('invalid-hex.scss'),
		]);

		expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(
			expect.stringMatching(/color-no-invalid-hex/),
		);
	});

	it('--custom-syntax and --config-basedir', async () => {
		await cli([
			'--custom-syntax=./custom-syntax.cjs',
			'--config-basedir',
			fixturesPath(),
			'--config',
			fixturesPath('config-color-no-invalid-hex.json'),
			fixturesPath('invalid-hex.scss'),
		]);

		expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(
			expect.stringMatching(/color-no-invalid-hex/),
		);
	});

	it("doesn't write to stdout or stderr when linting a file without errors", async () => {
		await cli([
			'--config',
			fixturesPath('config-block-empty-ok.json'),
			fixturesPath('empty-block.css'),
		]);

		expect(process.exitCode).toBeUndefined();

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).not.toHaveBeenCalled();
	});

	it('writes to stderr when linting a file with errors', async () => {
		await cli([
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('empty-block.css'),
		]);

		expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(expect.stringMatching(/block-no-empty/));
	});

	it('applies --fix to given files and shows no error messages', async () => {
		const cssFile1 = path.join(cssTmpDir, 'fix-test-1.css');
		const cssFile2 = path.join(cssTmpDir, 'fix-test-2.css');

		await fs.writeFile(cssFile1, 'a { top: 0px } a {');
		await fs.writeFile(cssFile2, 'b { top: 0px } b {');

		await cli([
			'--fix',
			cssFile1,
			cssFile2,
			'--config',
			fixturesPath('config-length-zero-no-unit-true.json'),
		]);

		expect(process.exitCode).toBeUndefined();
		expect(process.stderr.write).not.toHaveBeenCalled();

		expect(await fs.readFile(cssFile1, 'utf8')).toBe('a { top: 0 } a {}');
		expect(await fs.readFile(cssFile2, 'utf8')).toBe('b { top: 0 } b {}');
	});

	it('applies "--fix lax" to a given file and shows no error messages', async () => {
		const cssFile = path.join(cssTmpDir, 'fix-test.css');

		await fs.writeFile(cssFile, 'a { top: 0px } a {');

		await cli([
			'--fix',
			'lax',
			cssFile,
			'--config',
			fixturesPath('config-length-zero-no-unit-true.json'),
		]);

		expect(process.exitCode).toBeUndefined();
		expect(process.stderr.write).not.toHaveBeenCalled();

		expect(await fs.readFile(cssFile, 'utf8')).toBe('a { top: 0 } a {}');
	});

	it('applies --fix=lax and fixes without error message', async () => {
		jest.spyOn(process, 'stdin', 'get').mockImplementationOnce(() =>
			Readable.from([
				Buffer.from(stripIndent`
					a { top: 0px }
					a {
				`),
			]),
		);

		await cli([
			'--stdin',
			'--fix=lax',
			'--config',
			fixturesPath('config-length-zero-no-unit-true.json'),
		]);

		expect(process.exitCode).toBeUndefined();
		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).toHaveBeenCalledWith(stripIndent`
			a { top: 0 }
			a {}
		`);
		expect(process.stderr.write).not.toHaveBeenCalled();
	});

	it('applies --fix (lax) and fixes without error message', async () => {
		jest.spyOn(process, 'stdin', 'get').mockImplementationOnce(() =>
			Readable.from([
				Buffer.from(stripIndent`
					a { top: 0px }
					a {
				`),
			]),
		);

		await cli([
			'--stdin',
			'--fix',
			'--config',
			fixturesPath('config-length-zero-no-unit-true.json'),
		]);

		expect(process.exitCode).toBeUndefined();
		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).toHaveBeenCalledWith(stripIndent`
			a { top: 0 }
			a {}
		`);
		expect(process.stderr.write).not.toHaveBeenCalled();
	});

	it('does not fix with --fix=strict and displays error message', async () => {
		jest.spyOn(process, 'stdin', 'get').mockImplementationOnce(() =>
			Readable.from([
				Buffer.from(stripIndent`
					a { top: 0px }
					a {
				`),
			]),
		);

		await cli([
			'--stdin',
			'--fix=strict',
			'--config',
			fixturesPath('config-length-zero-no-unit-true.json'),
		]);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(expect.stringContaining('CssSyntaxError'));
		expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);
	});

	it('writes to stdout when linting code from stdin that can be fully fixed', async () => {
		jest
			.spyOn(process, 'stdin', 'get')
			.mockImplementationOnce(() => Readable.from([Buffer.from('a { color: #ffffff; }')]));
		await cli([
			'--stdin',
			'--fix',
			'--config',
			fixturesPath('config-block-no-empty-and-color-hex-length-short.json'),
		]);

		expect(process.exitCode).toBeUndefined();

		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).toHaveBeenCalledWith('a { color: #fff; }');
		expect(process.stderr.write).not.toHaveBeenCalled();
	});

	it('writes to stdout and stderr when linting code from stdin that can only be partially fixed', async () => {
		jest.spyOn(process, 'stdin', 'get').mockImplementationOnce(() =>
			Readable.from([
				Buffer.from(stripIndent`
				a { color: #ffffff; }
				div {}
			`),
			]),
		);
		await cli([
			'--stdin',
			'--fix',
			'--config',
			fixturesPath('config-block-no-empty-and-color-hex-length-short.json'),
		]);

		expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).toHaveBeenCalledWith(stripIndent`
			a { color: #fff; }
			div {}
		`);
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(expect.stringMatching(/block-no-empty/));
	});

	it('exits with an error message when an invalid flag is specified', async () => {
		await cli(['--foo']);

		expect(process.exitCode).toBe(EXIT_CODE_INVALID_USAGE);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(expect.stringMatching(/--foo/));
	});

	it('--compute-edit-info includes editInfo in warnings', async () => {
		jest
			.spyOn(process, 'stdin', 'get')
			.mockImplementationOnce(() => Readable.from([Buffer.from('a { color: #ffffff; }')]));

		await cli([
			'--stdin',
			'--compute-edit-info',
			'--formatter=json',
			'--config',
			fixturesPath('config-block-no-empty-and-color-hex-length-short.json'),
		]);

		expect(process.exitCode).toBe(EXIT_CODE_LINT_PROBLEM);

		expect(process.stdout.write).not.toHaveBeenCalled();
		expect(process.stderr.write).toHaveBeenCalledTimes(1);

		const output = JSON.parse(process.stderr.write.mock.calls[0][0]);

		expect(output).toBeInstanceOf(Array);
		expect(output[0].warnings[0].fix).toEqual({
			range: [15, 18],
			text: '',
		});
	});
});
