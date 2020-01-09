'use strict';

const { buildCLI } = require('../cli');

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
		expect(buildCLI(['--ignore-pattern=vendor/**']).flags.ignorePattern).toBe('vendor/**');
		expect(buildCLI(['--ip', 'vendor/**']).flags.ignorePattern).toBe('vendor/**');
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
