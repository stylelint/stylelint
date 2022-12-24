/* eslint no-console: off */

'use strict';

const path = require('path');
const stripAnsi = require('strip-ansi');

const cli = require('../cli');
const pkg = require('../../package.json');
const replaceBackslashes = require('../testUtils/replaceBackslashes');

const fixturesPath = (...elems) => replaceBackslashes(path.join(__dirname, 'fixtures', ...elems));
const { buildCLI } = cli;

jest.mock('../utils/getStdin', () => () => Promise.resolve(''));

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
			ignorePath: [],
			ignorePattern: [],
			printConfig: false,
			quiet: false,
			reportDescriptionlessDisables: false,
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

		expect(process.exitCode).toBeUndefined();

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

		expect(process.exitCode).toBe(2);

		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).toHaveBeenCalledWith(
			expect.stringMatching(/Needless disable for "color-named".*Unexpected empty block/s),
		);
	});

	it('reports disallowed disables', async () => {
		await cli([
			'--config',
			fixturesPath('config-block-no-empty-report-disables.json'),
			fixturesPath('empty-block-with-relevant-disable.css'),
		]);

		expect(process.exitCode).toBe(2);

		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).toHaveBeenCalledWith(
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

		expect(process.exitCode).toBe(2);

		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).toHaveBeenCalledWith(
			expect.stringContaining('Disable for "block-no-empty" is missing a description'),
		);
	});

	it('--stdin', async () => {
		await cli(['--stdin', '--config', fixturesPath('config-no-empty-source.json')]);

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
			fixturesPath('config-require-unknown.js'),
			fixturesPath('empty-block-with-disables.css'),
		]);

		expect(process.exitCode).toBe(1);

		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(process.stderr.write).toHaveBeenCalledWith(
			expect.stringContaining('Cannot find module'),
		);
	});

	it('outputs a valid JSON even if max warnings exceeded', async () => {
		await cli([
			'--formatter=json',
			'--max-warnings=0',
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		expect(process.exitCode).toBe(2);

		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		const output = JSON.parse(process.stdout.write.mock.calls[0][0]);

		expect(output).toBeInstanceOf(Array);
		expect(output[0]).toHaveProperty('source', expect.stringContaining('empty-block.css'));

		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(stripAnsi(process.stderr.write.mock.calls[0][0])).toContain(
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

		expect(process.exitCode).toBe(2);

		expect(process.stdout.write).toHaveBeenCalledTimes(0);
	});

	it('--custom-formatter with filesystem path', async () => {
		await cli([
			`--custom-formatter=${fixturesPath('formatters/customFormatter')}`,
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		const output = process.stdout.write.mock.calls[0][0];

		expect(output).toBe('Custom formatter reports 1 warning(s).');
	});

	it('--custom-formatter with node module', async () => {
		await cli([
			`--custom-formatter=stylelint-test-custom-formatter`,
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		const output = process.stdout.write.mock.calls[0][0];

		expect(output).toBe('Custom formatter reports 1 warning(s).');
	});

	it('output a message when wrong --globby-options provided', async () => {
		await cli(['--globby-options=wrong']);

		expect(process.exitCode).toBe(2);
		expect(process.stdout.write).toHaveBeenCalledTimes(0);
		expect(process.stderr.write).toHaveBeenCalledTimes(1);
		expect(stripAnsi(process.stderr.write.mock.calls[0][0])).toContain(
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

		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).toHaveBeenCalledWith(expect.stringMatching(/block-no-empty/));
	});

	it('--custom-syntax', async () => {
		await cli([
			'--custom-syntax=postcss-scss',
			'--config',
			fixturesPath('config-color-no-invalid-hex.json'),
			fixturesPath('invalid-hex.scss'),
		]);

		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).toHaveBeenCalledWith(
			expect.stringMatching(/color-no-invalid-hex/),
		);
	});

	it('--custom-syntax and --config-basedir', async () => {
		await cli([
			'--custom-syntax=./custom-syntax',
			'--config-basedir',
			fixturesPath(),
			'--config',
			fixturesPath('config-color-no-invalid-hex.json'),
			fixturesPath('invalid-hex.scss'),
		]);

		expect(process.stdout.write).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).toHaveBeenCalledWith(
			expect.stringMatching(/color-no-invalid-hex/),
		);
	});
});
