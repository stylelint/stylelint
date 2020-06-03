/* eslint no-console: off */

'use strict';

const path = require('path');

const cli = require('../cli');
const pkg = require('../../package.json');
const replaceBackslashes = require('../testUtils/replaceBackslashes');

const fixturesPath = replaceBackslashes(path.join(__dirname, 'fixtures'));
const { buildCLI } = cli;

jest.mock('get-stdin');

describe('buildCLI', () => {
	it('flags - default', () => {
		expect(buildCLI([]).flags).toEqual({
			allowEmptyInput: false,
			cache: false,
			color: false,
			disableDefaultIgnores: false,
			fix: false,
			formatter: 'string',
			help: false,
			ignoreDisables: false,
			printConfig: false,
			quiet: false,
			reportInvalidScopeDisables: false,
			reportNeedlessDisables: false,
			stdin: false,
			version: false,
		});
	});

	it('flags.allowEmptyInput', () => {
		expect(buildCLI(['--allow-empty-input']).flags.allowEmptyInput).toBe(true);
		expect(buildCLI(['--aei']).flags.allowEmptyInput).toBe(true);
	});

	it('flags.cache', () => {
		expect(buildCLI(['--cache']).flags.cache).toBe(true);
	});

	it('flags.cacheLocation', () => {
		expect(buildCLI(['--cache-location=foo']).flags.cacheLocation).toBe('foo');
	});

	it('flags.color', () => {
		expect(buildCLI(['--color']).flags.color).toBe(true);
		expect(buildCLI(['--no-color']).flags.color).toBe(false);
	});

	it('flags.config', () => {
		expect(buildCLI(['--config=/path/to/file']).flags.config).toBe('/path/to/file');
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
		expect(buildCLI(['--fix']).flags.fix).toBe(true);
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
		expect(buildCLI(['--ignore-path=/path/to/file']).flags.ignorePath).toBe('/path/to/file');
		expect(buildCLI(['-i', '/path/to/file']).flags.ignorePath).toBe('/path/to/file');
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

	it('flags.syntax', () => {
		expect(buildCLI(['--syntax=less']).flags.syntax).toBe('less');
		expect(buildCLI(['-s', 'less']).flags.syntax).toBe('less');
	});

	it('flags.version', () => {
		expect(buildCLI(['--version']).flags.version).toBe(true);
		expect(buildCLI(['-v']).flags.version).toBe(true);
	});
});

describe('CLI', () => {
	beforeAll(() => {
		jest.spyOn(process, 'exit').mockImplementation(() => {});
		jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
		jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
		jest.spyOn(console, 'log').mockImplementation(() => {});
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('basic', async () => {
		await cli([]);

		expect(process.exit).toHaveBeenCalledWith(2);

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

		expect(process.exitCode).toBeUndefined();

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith(expect.stringContaining(pkg.version));
	});

	it('--print-config', async () => {
		await cli([
			'--print-config',
			'--config',
			`${fixturesPath}/config-color-no-invalid-hex.json`,
			`${fixturesPath}/invalid-hex.css`,
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
			replaceBackslashes(path.join(fixturesPath, 'config-block-no-empty.json')),
			replaceBackslashes(path.join(fixturesPath, 'empty-block-with-disables.css')),
		]);

		expect(process.exitCode).toBe(2);

		expect(process.stdout.write).toHaveBeenCalledTimes(2);
		expect(process.stdout.write).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining('unused rule: color-named'),
		);
		expect(process.stdout.write).toHaveBeenNthCalledWith(
			2,
			expect.stringContaining('Unexpected empty block'),
		);
	});

	it('--stdin', async () => {
		await cli(['--stdin', '--config', `${fixturesPath}/config-no-empty-source.json`]);

		expect(process.exitCode).toBe(2);

		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining('Unexpected empty source'),
		);
	});

	it('exits with non zero on unfound module in config', async () => {
		await cli([
			'--config',
			replaceBackslashes(path.join(fixturesPath, 'config-require-unknown.js')),
			replaceBackslashes(path.join(fixturesPath, 'empty-block-with-disables.css')),
		]);

		expect(process.exitCode).toEqual(1);

		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(
			expect.stringContaining('Cannot find module'),
		);
	});
});
