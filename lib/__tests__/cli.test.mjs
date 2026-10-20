import * as fs from 'node:fs/promises';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import { Readable } from 'node:stream';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';
import { stripVTControlCharacters } from 'node:util';

import {
	EXIT_CODE_FATAL_ERROR,
	EXIT_CODE_INVALID_CONFIG,
	EXIT_CODE_INVALID_USAGE,
	EXIT_CODE_LINT_PROBLEM,
} from '../constants.mjs';
import assertWritten from '../testUtils/assertWritten.mjs';
import getRelativePath from '../utils/getRelativePath.mjs';
import mockStandardStreams from '../testUtils/mockStandardStreams.mjs';
import redirectModule from '../testUtils/redirectModule.mjs';
import replaceBackslashes from '../testUtils/replaceBackslashes.mjs';
import stripIndent from '../testUtils/stripIndent.mjs';

import cli, { buildCLI } from '../cli.mjs';

import pkg from '../../package.json' with { type: 'json' };

const fixturesPath = (...elems) =>
	replaceBackslashes(path.join(fileURLToPath(new URL('./fixtures', import.meta.url)), ...elems));

// `--custom-formatter` takes a package name; the fake package is the fixture instead of an install.
redirectModule(
	'stylelint-test-custom-formatter',
	new URL('./fixtures/custom-formatter.mjs', import.meta.url),
);

describe('buildCLI', () => {
	it('flags - default', () => {
		assert.deepEqual(buildCLI([]).flags, {
			'compute-edit-info': false,
			'ignore-path': [],
			'ignore-pattern': [],
			suppress: [],
			validate: true,
		});
	});

	it('optionNames', () => {
		assert.deepEqual(
			buildCLI(['--fix', '-c', 'foo', '--compute-edit-info', '--foo', '-x']).optionNames,
			['fix', 'config', 'compute-edit-info', 'foo', 'x'],
		);
	});

	it('flags.allow-empty-input', () => {
		assert.equal(buildCLI(['--allow-empty-input']).flags['allow-empty-input'], true);
	});

	it('flags.cache', () => {
		assert.equal(buildCLI(['--cache']).flags.cache, true);
		assert.equal(buildCLI(['--no-cache']).flags.cache, false);
	});

	it('flags.cache-location', () => {
		assert.equal(buildCLI(['--cache-location=foo']).flags['cache-location'], 'foo');
	});

	it('flags.globby-options', () => {
		const { flags } = buildCLI(['--globby-options={"dot":true}']);

		assert.equal(flags['globby-options'], '{"dot":true}');
	});

	it('flags.cache-strategy', () => {
		assert.equal(buildCLI(['--cache-strategy=content']).flags['cache-strategy'], 'content');
		assert.equal(buildCLI(['--cache-strategy=metadata']).flags['cache-strategy'], 'metadata');
	});

	it('flags.color', () => {
		assert.equal(buildCLI(['--color']).flags.color, true);
		assert.equal(buildCLI(['--no-color']).flags.color, false);
	});

	it('flags.config', () => {
		assert.equal(buildCLI(['--config=/path/to/file']).flags.config, '/path/to/file');
		assert.equal(buildCLI(['--config']).flags.config, undefined);
	});

	it('flags.config-basedir', () => {
		const { flags } = buildCLI(['--config-basedir=/path/to/dir']);

		assert.equal(flags['config-basedir'], '/path/to/dir');
	});

	it('flags.custom-formatter', () => {
		assert.equal(buildCLI(['--custom-formatter=foo']).flags['custom-formatter'], 'foo');
	});

	it('flags.custom-syntax', () => {
		assert.equal(buildCLI(['--custom-syntax=foo']).flags['custom-syntax'], 'foo');
	});

	it('flags.disable-default-ignores', () => {
		assert.equal(buildCLI(['--disable-default-ignores']).flags['disable-default-ignores'], true);
	});

	it('flags.fix', () => {
		assert.equal(buildCLI(['--fix']).flags.fix, '');
		assert.equal(buildCLI(['--fix=lax']).flags.fix, 'lax');
		assert.equal(buildCLI(['--fix=strict']).flags.fix, 'strict');
		assert.equal(buildCLI(['--fix=true']).flags.fix, 'true');
		assert.equal(buildCLI(['--fix=false']).flags.fix, 'false');
		assert.equal(buildCLI(['--fix=unknown']).flags.fix, 'unknown');
		assert.equal(buildCLI(['--fix lax']).flags.fix, undefined);
		assert.equal(buildCLI(['--fix strict']).flags.fix, undefined);
		assert.equal(buildCLI(['--fix true']).flags.fix, undefined);
		assert.equal(buildCLI(['--fix false']).flags.fix, undefined);
		assert.equal(buildCLI(['--fix unknown']).flags.fix, undefined);
		assert.partialDeepStrictEqual(buildCLI(['--fix', 'lax', 'a.css']), {
			flags: { fix: '' },
			input: ['lax', 'a.css'],
		});
		assert.partialDeepStrictEqual(buildCLI(['--fix', 'a.css', 'b.css']), {
			flags: { fix: '' },
			input: ['a.css', 'b.css'],
		});
	});

	it('flags.validate', () => {
		assert.equal(buildCLI(['--validate']).flags.validate, true);
		assert.equal(buildCLI(['--no-validate']).flags.validate, false);
	});

	it('flags.formatter', () => {
		assert.equal(buildCLI(['--formatter=json']).flags.formatter, 'json');
		assert.equal(buildCLI(['-f', 'json']).flags.formatter, 'json');
	});

	it('flags.help', () => {
		assert.equal(buildCLI(['--help']).flags.help, true);
		assert.equal(buildCLI(['-h']).flags.help, true);
	});

	it('flags.ignore-disables', () => {
		assert.equal(buildCLI(['--ignore-disables']).flags['ignore-disables'], true);
	});

	it('flags.ignore-path', () => {
		const ignorePathOf = (argv) => buildCLI(argv).flags['ignore-path'];

		assert.deepEqual(ignorePathOf(['--ignore-path=/path/to/file']), ['/path/to/file']);
		assert.deepEqual(ignorePathOf(['-i', '/path/to/file']), ['/path/to/file']);
		assert.deepEqual(
			ignorePathOf(['--ignore-path=/path/to/file1', '--ignore-path=/path/to/file2']),
			['/path/to/file1', '/path/to/file2'],
		);
		assert.deepEqual(ignorePathOf(['-i', '/path/to/file1', '-i', '/path/to/file2']), [
			'/path/to/file1',
			'/path/to/file2',
		]);
	});

	it('flags.ignore-pattern', () => {
		const ignorePatternOf = (argv) => buildCLI(argv).flags['ignore-pattern'];

		assert.deepEqual(ignorePatternOf(['--ignore-pattern=vendor/**']), ['vendor/**']);
		assert.deepEqual(ignorePatternOf(['--ignore-pattern', 'vendor/**']), ['vendor/**']);
		assert.deepEqual(
			ignorePatternOf(['--ignore-pattern', 'vendor/**', '--ignore-pattern', 'test/*.css']),
			['vendor/**', 'test/*.css'],
		);
	});

	it('flags.max-warnings', () => {
		assert.equal(buildCLI(['--max-warnings=7']).flags['max-warnings'], 7);
		assert.equal(buildCLI(['--max-warnings', '-1']).flags['max-warnings'], -1);
	});

	it('flags.output-file', () => {
		assert.equal(buildCLI(['--output-file=/path/to/file']).flags['output-file'], '/path/to/file');
		assert.equal(buildCLI(['-o', '/path/to/file']).flags['output-file'], '/path/to/file');
	});

	it('flags.print-config', () => {
		assert.equal(buildCLI(['--print-config']).flags['print-config'], true);
	});

	it('flags.quiet', () => {
		assert.equal(buildCLI(['--quiet']).flags.quiet, true);
		assert.equal(buildCLI(['-q']).flags.quiet, true);
	});

	it('flags.quiet-deprecation-warnings', () => {
		const { flags } = buildCLI(['--quiet-deprecation-warnings']);

		assert.equal(flags['quiet-deprecation-warnings'], true);
	});

	it('flags.report-invalid-scope-disables', () => {
		const { flags } = buildCLI(['--report-invalid-scope-disables']);

		assert.equal(flags['report-invalid-scope-disables'], true);
	});

	it('flags.report-needless-disables', () => {
		assert.equal(buildCLI(['--report-needless-disables']).flags['report-needless-disables'], true);
	});

	it('flags.stdin', () => {
		assert.equal(buildCLI(['--stdin']).flags.stdin, true);
	});

	it('flags.stdin-filename', () => {
		assert.equal(buildCLI(['--stdin-filename=foo.css']).flags['stdin-filename'], 'foo.css');
	});

	it('flags.version', () => {
		assert.equal(buildCLI(['--version']).flags.version, true);
		assert.equal(buildCLI(['-v']).flags.version, true);
	});

	it('flags.compute-edit-info', () => {
		assert.equal(buildCLI(['--compute-edit-info']).flags['compute-edit-info'], true);
	});

	it('flags.suppress', () => {
		assert.deepEqual(buildCLI(['--suppress']).flags.suppress, ['']);
		assert.deepEqual(buildCLI(['--suppress=foo']).flags.suppress, ['foo']);
		assert.deepEqual(buildCLI(['--suppress=foo', '--suppress=bar']).flags.suppress, ['foo', 'bar']);
		assert.partialDeepStrictEqual(buildCLI(['--suppress', '--fix']).flags, {
			suppress: [''],
			fix: '',
		});
	});

	it('flags.suppress-location', () => {
		assert.equal(buildCLI(['--suppress-location=foo']).flags['suppress-location'], 'foo');
	});
});

describe('CLI', () => {
	beforeEach(() => {
		mockStandardStreams();
	});

	afterEach(() => {
		mock.restoreAll();
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
		mock.getter(process, 'stdin', () => ({ isTTY: true }));

		await cli([]);

		assert.equal(process.exitCode, undefined);

		assert.equal(process.stdout.write.mock.callCount(), 1);
		assertWritten(process.stdout.write, 'Usage: stylelint [input] [options]');
	});

	it('--help', async (t) => {
		await cli(['--help']);

		assert.equal(process.exitCode, undefined);

		assert.equal(process.stdout.write.mock.callCount(), 1);
		t.assert.snapshot(process.stdout.write.mock.calls[0].arguments[0]);
	});

	it('--version', async () => {
		await cli(['--version']);

		assert.equal(process.exitCode, undefined);

		assert.equal(process.stdout.write.mock.callCount(), 1);
		assertWritten(process.stdout.write, pkg.version);
	});

	it('--print-config', async () => {
		await cli([
			'--print-config',
			'--config',
			fixturesPath('config-relative-plugin.json'),
			fixturesPath('invalid-hex.css'),
		]);

		assert.equal(process.exitCode, undefined);

		assert.equal(process.stdout.write.mock.callCount(), 1);
		assert.deepEqual(process.stdout.write.mock.calls[0].arguments, [
			JSON.stringify(
				{
					plugins: [
						fileURLToPath(new URL('./fixtures/plugin-warn-about-foo.mjs', import.meta.url)),
					],
					rules: {
						'plugin/warn-about-foo': ['always'],
					},
				},
				null,
				'  ',
			),
		]);
	});

	it('--report-needless-disables', async () => {
		await cli([
			'--report-needless-disables',
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('empty-block-with-disables.css'),
		]);

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /Needless disable for "color-named".*Empty block/s);
	});

	it('reports disallowed disables', async () => {
		await cli([
			'--config',
			fixturesPath('config-block-no-empty-report-disables.json'),
			fixturesPath('empty-block-with-relevant-disable.css'),
		]);

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'Rule "block-no-empty" may not be disabled');
	});

	it('reports descriptionless disables', async () => {
		await cli([
			'--report-descriptionless-disables',
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('empty-block-with-relevant-disable.css'),
		]);

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'Disable for "block-no-empty" is missing a description');
	});

	it('--color', async () => {
		await cli([
			'--color',
			'--config',
			fixturesPath('config-color-no-invalid-hex.json'),
			fixturesPath('invalid-hex.css'),
		]);

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, '\u001B[');
	});

	it('--no-color', async () => {
		await cli([
			'--no-color',
			'--config',
			fixturesPath('config-color-no-invalid-hex.json'),
			fixturesPath('invalid-hex.css'),
		]);

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stderr.write.mock.callCount(), 1);
		assert.ok(!process.stderr.write.mock.calls[0].arguments[0].includes('\u001B['));
	});

	it('--stdin with any input from stdin', async () => {
		mock.getter(process, 'stdin', () => Readable.from([]));

		await cli(['--stdin', '--config', fixturesPath('config-no-empty-source.json')]);

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'Empty source');
	});

	it('--stdin with no input from stdin', async () => {
		mock.getter(process, 'stdin', () => ({ isTTY: true }));

		await cli(['--stdin']);

		assert.equal(process.exitCode, EXIT_CODE_FATAL_ERROR);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(
			process.stderr.write,
			'You must pass stylelint a `files` glob or a `code` string',
		);
	});

	it('empty input from stdin without --stdin', async () => {
		mock.getter(process, 'stdin', () => Readable.from([]));

		await cli(['--config', fixturesPath('config-no-empty-source.json')]);

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'no-empty-source');
	});

	it('exits with non zero on unfound module in config', async () => {
		await cli([
			'--config',
			fixturesPath('config-require-unknown.cjs'),
			fixturesPath('empty-block-with-disables.css'),
		]);

		assert.equal(process.exitCode, EXIT_CODE_FATAL_ERROR);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'Cannot find module');
	});

	it('outputs a valid JSON to stderr even if max warnings exceeded', async () => {
		await cli([
			'--formatter=json',
			'--max-warnings=0',
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 2);
		const output = JSON.parse(process.stderr.write.mock.calls[0].arguments[0]);

		assert.ok(Array.isArray(output));
		assert.match(output[0].source, /empty-block\.css/);
		assert.match(
			stripVTControlCharacters(process.stderr.write.mock.calls[1].arguments[0]),
			/Max warnings exceeded: 1 found\. 0 allowed/,
		);
	});

	it('--quiet', async () => {
		await cli([
			'--quiet',
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		assert.equal(process.exitCode, undefined);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 0);
	});

	it('--quiet-deprecation-warnings', async () => {
		await cli([
			'--quiet-deprecation-warnings',
			'--config',
			fixturesPath('quiet-deprecation-warnings/config.json'),
			fixturesPath('quiet-deprecation-warnings/style.css'),
		]);

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assert.doesNotMatch(
			process.stderr.write.mock.calls[0].arguments[0],
			/The "color-hex-case" rule is deprecated\./,
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

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'deprecations: [],');
	});

	it('--custom-formatter with absolute path to CommonJS', async () => {
		await cli([
			'--custom-formatter',
			fixturesPath('custom-formatter.cjs'),
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'deprecations: [],');
	});

	it('--custom-formatter with relative path to ESM', async () => {
		await cli([
			'--custom-formatter',
			getRelativePath(process.cwd(), fixturesPath('custom-formatter.mjs')),
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'deprecations: [],');
	});

	it('--custom-formatter with relative path to CommonJS', async () => {
		await cli([
			'--custom-formatter',
			getRelativePath(process.cwd(), fixturesPath('custom-formatter.cjs')),
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'deprecations: [],');
	});

	it('--custom-formatter with node module', async () => {
		await cli([
			'--custom-formatter=stylelint-test-custom-formatter',
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'deprecations: [],');
	});

	it('output a message when wrong --globby-options provided', async () => {
		await cli(['--globby-options=wrong']);

		assert.equal(process.exitCode, EXIT_CODE_INVALID_USAGE);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assert.match(
			stripVTControlCharacters(process.stderr.write.mock.calls[0].arguments[0]),
			/Invalid option "--globby-options"\. The value "wrong" is not valid JSON object\./,
		);
	});

	it('--globby-options', async () => {
		await cli([
			'--globby-options={"dot":true}',
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('globby-options'),
		]);

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /block-no-empty/);
	});

	it('output a message when unsupported --globby-options provided', async () => {
		await cli([
			'--globby-options={"cwd":"."}',
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('globby-options'),
		]);

		assert.equal(process.exitCode, EXIT_CODE_INVALID_CONFIG);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'unknown option "cwd"');
	});

	it('--custom-syntax', async () => {
		await cli([
			'--custom-syntax=postcss-scss',
			'--config',
			fixturesPath('config-color-no-invalid-hex.json'),
			fixturesPath('invalid-hex.scss'),
		]);

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /color-no-invalid-hex/);
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

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /color-no-invalid-hex/);
	});

	it("doesn't write to stdout or stderr when linting a file without errors", async () => {
		await cli([
			'--config',
			fixturesPath('config-block-empty-ok.json'),
			fixturesPath('empty-block.css'),
		]);

		assert.equal(process.exitCode, undefined);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 0);
	});

	it('writes to stderr when linting a file with errors', async () => {
		await cli([
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('empty-block.css'),
		]);

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /block-no-empty/);
	});

	it('applies --fix to given files and shows no error messages', async () => {
		const cssFile1 = path.join(cssTmpDir, 'fix-test-1.css');
		const cssFile2 = path.join(cssTmpDir, 'fix-test-2.css');

		await fs.writeFile(cssFile1, 'a { top: 0px }');
		await fs.writeFile(cssFile2, 'b { top: 0px }');

		await cli([
			'--fix',
			cssFile1,
			cssFile2,
			'--config',
			fixturesPath('config-length-zero-no-unit-true.json'),
		]);

		assert.equal(process.exitCode, undefined);
		assert.equal(process.stderr.write.mock.callCount(), 0);

		assert.equal(await fs.readFile(cssFile1, 'utf8'), 'a { top: 0 }');
		assert.equal(await fs.readFile(cssFile2, 'utf8'), 'b { top: 0 }');
	});

	it('applies --fix=lax to a given file and shows no error messages', async () => {
		const cssFile = path.join(cssTmpDir, 'fix-test.css');

		await fs.writeFile(cssFile, 'a { top: 0px } a {');

		await cli([
			'--fix=lax',
			cssFile,
			'--config',
			fixturesPath('config-length-zero-no-unit-true.json'),
		]);

		assert.equal(process.exitCode, undefined);
		assert.equal(process.stderr.write.mock.callCount(), 0);

		assert.equal(await fs.readFile(cssFile, 'utf8'), 'a { top: 0 } a {}');
	});

	it('applies --fix=lax and fixes without error message', async () => {
		mock.getter(process, 'stdin', () =>
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

		assert.equal(process.exitCode, undefined);
		assert.equal(process.stdout.write.mock.callCount(), 1);
		assert.deepEqual(process.stdout.write.mock.calls[0].arguments, [
			stripIndent`
			a { top: 0 }
			a {}
		`,
		]);
		assert.equal(process.stderr.write.mock.callCount(), 0);
	});

	it('applies --fix (strict) and fixes without error message', async () => {
		mock.getter(process, 'stdin', () =>
			Readable.from([
				Buffer.from(stripIndent`
					a { top: 0px }
				`),
			]),
		);

		await cli([
			'--stdin',
			'--fix',
			'--config',
			fixturesPath('config-length-zero-no-unit-true.json'),
		]);

		assert.equal(process.exitCode, undefined);
		assert.equal(process.stdout.write.mock.callCount(), 1);
		assert.deepEqual(process.stdout.write.mock.calls[0].arguments, [
			stripIndent`
			a { top: 0 }
		`,
		]);
		assert.equal(process.stderr.write.mock.callCount(), 0);
	});

	it('does not fix with --fix=strict and displays error message', async () => {
		mock.getter(process, 'stdin', () =>
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

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'CssSyntaxError');
		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);
	});

	it('writes to stdout when linting code from stdin that can be fully fixed', async () => {
		mock.getter(process, 'stdin', () => Readable.from([Buffer.from('a { color: #ffffff; }')]));
		await cli([
			'--stdin',
			'--fix',
			'--config',
			fixturesPath('config-block-no-empty-and-color-hex-length-short.json'),
		]);

		assert.equal(process.exitCode, undefined);

		assert.equal(process.stdout.write.mock.callCount(), 1);
		assert.deepEqual(process.stdout.write.mock.calls[0].arguments, ['a { color: #fff; }']);
		assert.equal(process.stderr.write.mock.callCount(), 0);
	});

	it('writes to stdout and stderr when linting code from stdin that can only be partially fixed', async () => {
		mock.getter(process, 'stdin', () =>
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

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stdout.write.mock.callCount(), 1);
		assert.deepEqual(process.stdout.write.mock.calls[0].arguments, [
			stripIndent`
			a { color: #fff; }
			div {}
		`,
		]);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /block-no-empty/);
	});

	it('exits with an error message when an invalid flag is specified', async () => {
		await cli(['--foo']);

		assert.equal(process.exitCode, EXIT_CODE_INVALID_USAGE);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /--foo/);
	});

	it('exits with an error message when a boolean flag has a value', async () => {
		await cli(['--cache=false']);

		assert.equal(process.exitCode, EXIT_CODE_INVALID_USAGE);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /--cache=false.*--no-cache/);
	});

	it('exits with an error message when a short flag has an = before its value', async () => {
		await cli(['-c=foo']);

		assert.equal(process.exitCode, EXIT_CODE_INVALID_USAGE);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /-c=foo.*-c foo/);
	});

	it('exits with an error message when a removed alias is specified', async () => {
		await cli(['--aei']);

		assert.equal(process.exitCode, EXIT_CODE_INVALID_USAGE);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /--aei.*--allow-empty-input/);
	});

	it('exits with an error message when a camelCase flag is specified', async () => {
		await cli(['--allowEmptyInput']);

		assert.equal(process.exitCode, EXIT_CODE_INVALID_USAGE);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /--allowEmptyInput.*--allow-empty-input/);
	});

	it('--compute-edit-info includes editInfo in warnings', async () => {
		mock.getter(process, 'stdin', () => Readable.from([Buffer.from('a { color: #ffffff; }')]));

		await cli([
			'--stdin',
			'--compute-edit-info',
			'--formatter=json',
			'--config',
			fixturesPath('config-block-no-empty-and-color-hex-length-short.json'),
		]);

		assert.equal(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		assert.equal(process.stdout.write.mock.callCount(), 0);
		assert.equal(process.stderr.write.mock.callCount(), 1);

		const output = JSON.parse(process.stderr.write.mock.calls[0].arguments[0]);

		assert.ok(Array.isArray(output));
		assert.deepEqual(output[0].warnings[0].fix, {
			range: [15, 18],
			text: '',
		});
	});
});
