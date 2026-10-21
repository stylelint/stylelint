import * as fs from 'node:fs/promises';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import { Readable } from 'node:stream';
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
	it('flags - default', (t) => {
		t.assert.deepStrictEqual(buildCLI([]).flags, {
			'compute-edit-info': false,
			'ignore-path': [],
			'ignore-pattern': [],
			suppress: [],
			validate: true,
		});
	});

	it('optionNames', (t) => {
		t.assert.deepStrictEqual(
			buildCLI(['--fix', '-c', 'foo', '--compute-edit-info', '--foo', '-x']).optionNames,
			['fix', 'config', 'compute-edit-info', 'foo', 'x'],
		);
	});

	it('flags.allow-empty-input', (t) => {
		t.assert.strictEqual(buildCLI(['--allow-empty-input']).flags['allow-empty-input'], true);
	});

	it('flags.cache', (t) => {
		t.assert.strictEqual(buildCLI(['--cache']).flags.cache, true);
		t.assert.strictEqual(buildCLI(['--no-cache']).flags.cache, false);
	});

	it('flags.cache-location', (t) => {
		t.assert.strictEqual(buildCLI(['--cache-location=foo']).flags['cache-location'], 'foo');
	});

	it('flags.globby-options', (t) => {
		const { flags } = buildCLI(['--globby-options={"dot":true}']);

		t.assert.strictEqual(flags['globby-options'], '{"dot":true}');
	});

	it('flags.cache-strategy', (t) => {
		t.assert.strictEqual(buildCLI(['--cache-strategy=content']).flags['cache-strategy'], 'content');
		t.assert.strictEqual(
			buildCLI(['--cache-strategy=metadata']).flags['cache-strategy'],
			'metadata',
		);
	});

	it('flags.color', (t) => {
		t.assert.strictEqual(buildCLI(['--color']).flags.color, true);
		t.assert.strictEqual(buildCLI(['--no-color']).flags.color, false);
	});

	it('flags.config', (t) => {
		t.assert.strictEqual(buildCLI(['--config=/path/to/file']).flags.config, '/path/to/file');
		t.assert.strictEqual(buildCLI(['--config']).flags.config, undefined);
	});

	it('flags.config-basedir', (t) => {
		const { flags } = buildCLI(['--config-basedir=/path/to/dir']);

		t.assert.strictEqual(flags['config-basedir'], '/path/to/dir');
	});

	it('flags.custom-formatter', (t) => {
		t.assert.strictEqual(buildCLI(['--custom-formatter=foo']).flags['custom-formatter'], 'foo');
	});

	it('flags.custom-syntax', (t) => {
		t.assert.strictEqual(buildCLI(['--custom-syntax=foo']).flags['custom-syntax'], 'foo');
	});

	it('flags.disable-default-ignores', (t) => {
		t.assert.strictEqual(
			buildCLI(['--disable-default-ignores']).flags['disable-default-ignores'],
			true,
		);
	});

	it('flags.fix', (t) => {
		t.assert.strictEqual(buildCLI(['--fix']).flags.fix, '');
		t.assert.strictEqual(buildCLI(['--fix=lax']).flags.fix, 'lax');
		t.assert.strictEqual(buildCLI(['--fix=strict']).flags.fix, 'strict');
		t.assert.strictEqual(buildCLI(['--fix=true']).flags.fix, 'true');
		t.assert.strictEqual(buildCLI(['--fix=false']).flags.fix, 'false');
		t.assert.strictEqual(buildCLI(['--fix=unknown']).flags.fix, 'unknown');
		t.assert.strictEqual(buildCLI(['--fix lax']).flags.fix, undefined);
		t.assert.strictEqual(buildCLI(['--fix strict']).flags.fix, undefined);
		t.assert.strictEqual(buildCLI(['--fix true']).flags.fix, undefined);
		t.assert.strictEqual(buildCLI(['--fix false']).flags.fix, undefined);
		t.assert.strictEqual(buildCLI(['--fix unknown']).flags.fix, undefined);
		t.assert.partialDeepStrictEqual(buildCLI(['--fix', 'lax', 'a.css']), {
			flags: { fix: '' },
			input: ['lax', 'a.css'],
		});
		t.assert.partialDeepStrictEqual(buildCLI(['--fix', 'a.css', 'b.css']), {
			flags: { fix: '' },
			input: ['a.css', 'b.css'],
		});
	});

	it('flags.validate', (t) => {
		t.assert.strictEqual(buildCLI(['--validate']).flags.validate, true);
		t.assert.strictEqual(buildCLI(['--no-validate']).flags.validate, false);
	});

	it('flags.formatter', (t) => {
		t.assert.strictEqual(buildCLI(['--formatter=json']).flags.formatter, 'json');
		t.assert.strictEqual(buildCLI(['-f', 'json']).flags.formatter, 'json');
	});

	it('flags.help', (t) => {
		t.assert.strictEqual(buildCLI(['--help']).flags.help, true);
		t.assert.strictEqual(buildCLI(['-h']).flags.help, true);
	});

	it('flags.ignore-disables', (t) => {
		t.assert.strictEqual(buildCLI(['--ignore-disables']).flags['ignore-disables'], true);
	});

	it('flags.ignore-path', (t) => {
		const ignorePathOf = (argv) => buildCLI(argv).flags['ignore-path'];

		t.assert.deepStrictEqual(ignorePathOf(['--ignore-path=/path/to/file']), ['/path/to/file']);
		t.assert.deepStrictEqual(ignorePathOf(['-i', '/path/to/file']), ['/path/to/file']);
		t.assert.deepStrictEqual(
			ignorePathOf(['--ignore-path=/path/to/file1', '--ignore-path=/path/to/file2']),
			['/path/to/file1', '/path/to/file2'],
		);
		t.assert.deepStrictEqual(ignorePathOf(['-i', '/path/to/file1', '-i', '/path/to/file2']), [
			'/path/to/file1',
			'/path/to/file2',
		]);
	});

	it('flags.ignore-pattern', (t) => {
		const ignorePatternOf = (argv) => buildCLI(argv).flags['ignore-pattern'];

		t.assert.deepStrictEqual(ignorePatternOf(['--ignore-pattern=vendor/**']), ['vendor/**']);
		t.assert.deepStrictEqual(ignorePatternOf(['--ignore-pattern', 'vendor/**']), ['vendor/**']);
		t.assert.deepStrictEqual(
			ignorePatternOf(['--ignore-pattern', 'vendor/**', '--ignore-pattern', 'test/*.css']),
			['vendor/**', 'test/*.css'],
		);
	});

	it('flags.max-warnings', (t) => {
		t.assert.strictEqual(buildCLI(['--max-warnings=7']).flags['max-warnings'], 7);
		t.assert.strictEqual(buildCLI(['--max-warnings', '-1']).flags['max-warnings'], -1);
	});

	it('flags.output-file', (t) => {
		t.assert.strictEqual(
			buildCLI(['--output-file=/path/to/file']).flags['output-file'],
			'/path/to/file',
		);
		t.assert.strictEqual(buildCLI(['-o', '/path/to/file']).flags['output-file'], '/path/to/file');
	});

	it('flags.print-config', (t) => {
		t.assert.strictEqual(buildCLI(['--print-config']).flags['print-config'], true);
	});

	it('flags.quiet', (t) => {
		t.assert.strictEqual(buildCLI(['--quiet']).flags.quiet, true);
		t.assert.strictEqual(buildCLI(['-q']).flags.quiet, true);
	});

	it('flags.quiet-deprecation-warnings', (t) => {
		const { flags } = buildCLI(['--quiet-deprecation-warnings']);

		t.assert.strictEqual(flags['quiet-deprecation-warnings'], true);
	});

	it('flags.report-invalid-scope-disables', (t) => {
		const { flags } = buildCLI(['--report-invalid-scope-disables']);

		t.assert.strictEqual(flags['report-invalid-scope-disables'], true);
	});

	it('flags.report-needless-disables', (t) => {
		t.assert.strictEqual(
			buildCLI(['--report-needless-disables']).flags['report-needless-disables'],
			true,
		);
	});

	it('flags.stdin', (t) => {
		t.assert.strictEqual(buildCLI(['--stdin']).flags.stdin, true);
	});

	it('flags.stdin-filename', (t) => {
		t.assert.strictEqual(buildCLI(['--stdin-filename=foo.css']).flags['stdin-filename'], 'foo.css');
	});

	it('flags.version', (t) => {
		t.assert.strictEqual(buildCLI(['--version']).flags.version, true);
		t.assert.strictEqual(buildCLI(['-v']).flags.version, true);
	});

	it('flags.compute-edit-info', (t) => {
		t.assert.strictEqual(buildCLI(['--compute-edit-info']).flags['compute-edit-info'], true);
	});

	it('flags.suppress', (t) => {
		t.assert.deepStrictEqual(buildCLI(['--suppress']).flags.suppress, ['']);
		t.assert.deepStrictEqual(buildCLI(['--suppress=foo']).flags.suppress, ['foo']);
		t.assert.deepStrictEqual(buildCLI(['--suppress=foo', '--suppress=bar']).flags.suppress, [
			'foo',
			'bar',
		]);
		t.assert.partialDeepStrictEqual(buildCLI(['--suppress', '--fix']).flags, {
			suppress: [''],
			fix: '',
		});
	});

	it('flags.suppress-location', (t) => {
		t.assert.strictEqual(buildCLI(['--suppress-location=foo']).flags['suppress-location'], 'foo');
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

	it('no arguments', async (t) => {
		mock.getter(process, 'stdin', () => ({ isTTY: true }));

		await cli([]);

		t.assert.strictEqual(process.exitCode, undefined);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 1);
		assertWritten(process.stdout.write, 'Usage: stylelint [input] [options]');
	});

	it('--help', async (t) => {
		await cli(['--help']);

		t.assert.strictEqual(process.exitCode, undefined);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 1);
		t.assert.snapshot(process.stdout.write.mock.calls[0].arguments[0]);
	});

	it('--version', async (t) => {
		await cli(['--version']);

		t.assert.strictEqual(process.exitCode, undefined);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 1);
		assertWritten(process.stdout.write, pkg.version);
	});

	it('--print-config', async (t) => {
		await cli([
			'--print-config',
			'--config',
			fixturesPath('config-relative-plugin.json'),
			fixturesPath('invalid-hex.css'),
		]);

		t.assert.strictEqual(process.exitCode, undefined);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 1);
		t.assert.deepStrictEqual(process.stdout.write.mock.calls[0].arguments, [
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

	it('--report-needless-disables', async (t) => {
		await cli([
			'--report-needless-disables',
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('empty-block-with-disables.css'),
		]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /Needless disable for "color-named".*Empty block/s);
	});

	it('reports disallowed disables', async (t) => {
		await cli([
			'--config',
			fixturesPath('config-block-no-empty-report-disables.json'),
			fixturesPath('empty-block-with-relevant-disable.css'),
		]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'Rule "block-no-empty" may not be disabled');
	});

	it('reports descriptionless disables', async (t) => {
		await cli([
			'--report-descriptionless-disables',
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('empty-block-with-relevant-disable.css'),
		]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'Disable for "block-no-empty" is missing a description');
	});

	it('--color', async (t) => {
		await cli([
			'--color',
			'--config',
			fixturesPath('config-color-no-invalid-hex.json'),
			fixturesPath('invalid-hex.css'),
		]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, '\u001B[');
	});

	it('--no-color', async (t) => {
		await cli([
			'--no-color',
			'--config',
			fixturesPath('config-color-no-invalid-hex.json'),
			fixturesPath('invalid-hex.css'),
		]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		t.assert.ok(!process.stderr.write.mock.calls[0].arguments[0].includes('\u001B['));
	});

	it('--stdin with any input from stdin', async (t) => {
		mock.getter(process, 'stdin', () => Readable.from([]));

		await cli(['--stdin', '--config', fixturesPath('config-no-empty-source.json')]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'Empty source');
	});

	it('--stdin with no input from stdin', async (t) => {
		mock.getter(process, 'stdin', () => ({ isTTY: true }));

		await cli(['--stdin']);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_FATAL_ERROR);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(
			process.stderr.write,
			'You must pass stylelint a `files` glob or a `code` string',
		);
	});

	it('empty input from stdin without --stdin', async (t) => {
		mock.getter(process, 'stdin', () => Readable.from([]));

		await cli(['--config', fixturesPath('config-no-empty-source.json')]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'no-empty-source');
	});

	it('exits with non zero on unfound module in config', async (t) => {
		await cli([
			'--config',
			fixturesPath('config-require-unknown.cjs'),
			fixturesPath('empty-block-with-disables.css'),
		]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_FATAL_ERROR);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'Cannot find module');
	});

	it('outputs a valid JSON to stderr even if max warnings exceeded', async (t) => {
		await cli([
			'--formatter=json',
			'--max-warnings=0',
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 2);
		const output = JSON.parse(process.stderr.write.mock.calls[0].arguments[0]);

		t.assert.ok(Array.isArray(output));
		t.assert.match(output[0].source, /empty-block\.css/);
		t.assert.match(
			stripVTControlCharacters(process.stderr.write.mock.calls[1].arguments[0]),
			/Max warnings exceeded: 1 found\. 0 allowed/,
		);
	});

	it('--quiet', async (t) => {
		await cli([
			'--quiet',
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		t.assert.strictEqual(process.exitCode, undefined);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 0);
	});

	it('--quiet-deprecation-warnings', async (t) => {
		await cli([
			'--quiet-deprecation-warnings',
			'--config',
			fixturesPath('quiet-deprecation-warnings/config.json'),
			fixturesPath('quiet-deprecation-warnings/style.css'),
		]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		t.assert.doesNotMatch(
			process.stderr.write.mock.calls[0].arguments[0],
			/The "color-hex-case" rule is deprecated\./,
		);
	});

	it('--custom-formatter with absolute path to ESM', async (t) => {
		await cli([
			'--custom-formatter',
			fixturesPath('custom-formatter.mjs'),
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'deprecations: [],');
	});

	it('--custom-formatter with absolute path to CommonJS', async (t) => {
		await cli([
			'--custom-formatter',
			fixturesPath('custom-formatter.cjs'),
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'deprecations: [],');
	});

	it('--custom-formatter with relative path to ESM', async (t) => {
		await cli([
			'--custom-formatter',
			getRelativePath(process.cwd(), fixturesPath('custom-formatter.mjs')),
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'deprecations: [],');
	});

	it('--custom-formatter with relative path to CommonJS', async (t) => {
		await cli([
			'--custom-formatter',
			getRelativePath(process.cwd(), fixturesPath('custom-formatter.cjs')),
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'deprecations: [],');
	});

	it('--custom-formatter with node module', async (t) => {
		await cli([
			'--custom-formatter=stylelint-test-custom-formatter',
			'--config',
			fixturesPath('default-severity-warning.json'),
			fixturesPath('empty-block.css'),
		]);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'deprecations: [],');
	});

	it('output a message when wrong --globby-options provided', async (t) => {
		await cli(['--globby-options=wrong']);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_INVALID_USAGE);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		t.assert.match(
			stripVTControlCharacters(process.stderr.write.mock.calls[0].arguments[0]),
			/Invalid option "--globby-options"\. The value "wrong" is not valid JSON object\./,
		);
	});

	it('--globby-options', async (t) => {
		await cli([
			'--globby-options={"dot":true}',
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('globby-options'),
		]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /block-no-empty/);
	});

	it('output a message when unsupported --globby-options provided', async (t) => {
		await cli([
			'--globby-options={"cwd":"."}',
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('globby-options'),
		]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_INVALID_CONFIG);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'unknown option "cwd"');
	});

	it('--custom-syntax', async (t) => {
		await cli([
			'--custom-syntax=postcss-scss',
			'--config',
			fixturesPath('config-color-no-invalid-hex.json'),
			fixturesPath('invalid-hex.scss'),
		]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /color-no-invalid-hex/);
	});

	it('--custom-syntax and --config-basedir', async (t) => {
		await cli([
			'--custom-syntax=./custom-syntax.cjs',
			'--config-basedir',
			fixturesPath(),
			'--config',
			fixturesPath('config-color-no-invalid-hex.json'),
			fixturesPath('invalid-hex.scss'),
		]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /color-no-invalid-hex/);
	});

	it("doesn't write to stdout or stderr when linting a file without errors", async (t) => {
		await cli([
			'--config',
			fixturesPath('config-block-empty-ok.json'),
			fixturesPath('empty-block.css'),
		]);

		t.assert.strictEqual(process.exitCode, undefined);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 0);
	});

	it('writes to stderr when linting a file with errors', async (t) => {
		await cli([
			'--config',
			fixturesPath('config-block-no-empty.json'),
			fixturesPath('empty-block.css'),
		]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /block-no-empty/);
	});

	it('applies --fix to given files and shows no error messages', async (t) => {
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

		t.assert.strictEqual(process.exitCode, undefined);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 0);

		t.assert.strictEqual(await fs.readFile(cssFile1, 'utf8'), 'a { top: 0 }');
		t.assert.strictEqual(await fs.readFile(cssFile2, 'utf8'), 'b { top: 0 }');
	});

	it('applies --fix=lax to a given file and shows no error messages', async (t) => {
		const cssFile = path.join(cssTmpDir, 'fix-test.css');

		await fs.writeFile(cssFile, 'a { top: 0px } a {');

		await cli([
			'--fix=lax',
			cssFile,
			'--config',
			fixturesPath('config-length-zero-no-unit-true.json'),
		]);

		t.assert.strictEqual(process.exitCode, undefined);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 0);

		t.assert.strictEqual(await fs.readFile(cssFile, 'utf8'), 'a { top: 0 } a {}');
	});

	it('applies --fix=lax and fixes without error message', async (t) => {
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

		t.assert.strictEqual(process.exitCode, undefined);
		t.assert.strictEqual(process.stdout.write.mock.callCount(), 1);
		t.assert.deepStrictEqual(process.stdout.write.mock.calls[0].arguments, [
			stripIndent`
			a { top: 0 }
			a {}
		`,
		]);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 0);
	});

	it('applies --fix (strict) and fixes without error message', async (t) => {
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

		t.assert.strictEqual(process.exitCode, undefined);
		t.assert.strictEqual(process.stdout.write.mock.callCount(), 1);
		t.assert.deepStrictEqual(process.stdout.write.mock.calls[0].arguments, [
			stripIndent`
			a { top: 0 }
		`,
		]);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 0);
	});

	it('does not fix with --fix=strict and displays error message', async (t) => {
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

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, 'CssSyntaxError');
		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);
	});

	it('writes to stdout when linting code from stdin that can be fully fixed', async (t) => {
		mock.getter(process, 'stdin', () => Readable.from([Buffer.from('a { color: #ffffff; }')]));
		await cli([
			'--stdin',
			'--fix',
			'--config',
			fixturesPath('config-block-no-empty-and-color-hex-length-short.json'),
		]);

		t.assert.strictEqual(process.exitCode, undefined);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 1);
		t.assert.deepStrictEqual(process.stdout.write.mock.calls[0].arguments, ['a { color: #fff; }']);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 0);
	});

	it('writes to stdout and stderr when linting code from stdin that can only be partially fixed', async (t) => {
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

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 1);
		t.assert.deepStrictEqual(process.stdout.write.mock.calls[0].arguments, [
			stripIndent`
			a { color: #fff; }
			div {}
		`,
		]);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /block-no-empty/);
	});

	it('exits with an error message when an invalid flag is specified', async (t) => {
		await cli(['--foo']);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_INVALID_USAGE);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /--foo/);
	});

	it('exits with an error message when a boolean flag has a value', async (t) => {
		await cli(['--cache=false']);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_INVALID_USAGE);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /--cache=false.*--no-cache/);
	});

	it('exits with an error message when a short flag has an = before its value', async (t) => {
		await cli(['-c=foo']);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_INVALID_USAGE);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /-c=foo.*-c foo/);
	});

	it('exits with an error message when a removed alias is specified', async (t) => {
		await cli(['--aei']);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_INVALID_USAGE);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /--aei.*--allow-empty-input/);
	});

	it('exits with an error message when a camelCase flag is specified', async (t) => {
		await cli(['--allowEmptyInput']);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_INVALID_USAGE);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);
		assertWritten(process.stderr.write, /--allowEmptyInput.*--allow-empty-input/);
	});

	it('--compute-edit-info includes editInfo in warnings', async (t) => {
		mock.getter(process, 'stdin', () => Readable.from([Buffer.from('a { color: #ffffff; }')]));

		await cli([
			'--stdin',
			'--compute-edit-info',
			'--formatter=json',
			'--config',
			fixturesPath('config-block-no-empty-and-color-hex-length-short.json'),
		]);

		t.assert.strictEqual(process.exitCode, EXIT_CODE_LINT_PROBLEM);

		t.assert.strictEqual(process.stdout.write.mock.callCount(), 0);
		t.assert.strictEqual(process.stderr.write.mock.callCount(), 1);

		const output = JSON.parse(process.stderr.write.mock.calls[0].arguments[0]);

		t.assert.ok(Array.isArray(output));
		t.assert.deepStrictEqual(output[0].warnings[0].fix, {
			range: [15, 18],
			text: '',
		});
	});
});
