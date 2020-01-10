/* eslint no-console: off */
'use strict';

const cli = require('../../lib/cli');
const path = require('path');
const pkg = require('../../package.json');
const { replaceBackslashes } = require('../systemTestUtils');

jest.mock('get-stdin');

describe('CLI', () => {
	let processRestore;
	let logRestore;

	beforeAll(() => {
		processRestore = { ...process };
		logRestore = { ...console };
		process.exit = (exitCode) => (process.exitCode = exitCode);
	});

	afterAll(() => {
		Object.assign(process, processRestore);
		Object.assign(console, logRestore);
	});

	beforeEach(function() {
		process.exitCode = undefined;
		console.log = jest.fn();
		process.stdout.write = jest.fn();

		if (parseInt(process.versions.node) < 7) {
			// https://github.com/sindresorhus/get-stdin/issues/13
			process.nextTick(() => {
				process.stdin.end();
			});
		}
	});

	it('basic', () => {
		return cli([]).then(() => {
			expect(process.exitCode).toBe(2);
			expect(console.log.mock.calls).toHaveLength(1);
			const lastCallArgs = console.log.mock.calls.pop();

			expect(lastCallArgs).toHaveLength(1);
			expect(lastCallArgs.pop()).toMatch('Usage: stylelint [input] [options]');
		});
	});

	it('--help', () => {
		return Promise.resolve(cli(['--help'])).then(() => {
			expect(process.exitCode).toBe(0);
			expect(console.log.mock.calls).toHaveLength(1);
			const lastCallArgs = console.log.mock.calls.pop();

			expect(lastCallArgs).toHaveLength(1);
			expect(lastCallArgs.pop()).toMatchInlineSnapshot(`
			"
			  A mighty, modern CSS linter.

			  Usage: stylelint [input] [options]

			  Input: Files(s), glob(s), or nothing to use stdin.

			    If an input argument is wrapped in quotation marks, it will be passed to
			    globby for cross-platform glob support. node_modules are always ignored.
			    You can also pass no input and use stdin, instead.

			  Options:

			    --config

			      Path to a specific configuration file (JSON, YAML, or CommonJS), or the
			      name of a module in node_modules that points to one. If no --config
			      argument is provided, stylelint will search for configuration files in
			      the following places, in this order:
			        - a stylelint property in package.json
			        - a .stylelintrc file (with or without filename extension:
			          .json, .yaml, .yml, and .js are available)
			        - a stylelint.config.js file exporting a JS object
			      The search will begin in the working directory and move up the directory
			      tree until a configuration file is found.

			    --config-basedir

			      An absolute path to the directory that relative paths defining \\"extends\\"
			      and \\"plugins\\" are *relative to*. Only necessary if these values are
			      relative paths.

			    --print-config

			      Print the configuration for the given path.

			    --ignore-path, -i

			      Path to a file containing patterns that describe files to ignore. The
			      path can be absolute or relative to process.cwd(). By default, stylelint
			      looks for .stylelintignore in process.cwd().

			    --ignore-pattern, --ip

			      Pattern of files to ignore (in addition to those in .stylelintignore)

			    --syntax, -s

			      Specify a syntax. Options: \\"css\\", \\"css-in-js\\", \\"html\\", \\"less\\",
			      \\"markdown\\", \\"sass\\", \\"scss\\", \\"sugarss\\". If you do not specify a syntax,
			      syntaxes will be automatically inferred by the file extensions
			      and file content.

			    --fix

			      Automatically fix violations of certain rules.

			    --custom-syntax

			      Module name or path to a JS file exporting a PostCSS-compatible syntax.

			    --stdin-filename

			      A filename to assign stdin input.

			    --ignore-disables, --id

			      Ignore styleline-disable comments.

			    --disable-default-ignores, --di

			      Allow linting of node_modules.

			    --cache                       [default: false]

			      Store the info about processed files in order to only operate on the
			      changed ones the next time you run stylelint. By default, the cache
			      is stored in \\"./.stylelintcache\\". To adjust this, use --cache-location.

			    --cache-location              [default: '.stylelintcache']

			      Path to a file or directory to be used for the cache location.
			      Default is \\"./.stylelintcache\\". If a directory is specified, a cache
			      file will be created inside the specified folder, with a name derived
			      from a hash of the current working directory.

			      If the directory for the cache does not exist, make sure you add a trailing \\"/\\"
			      on *nix systems or \\"\\\\\\" on Windows. Otherwise the path will be assumed to be a file.

			    --formatter, -f               [default: \\"string\\"]

			      The output formatter: \\"compact\\", \\"json\\", \\"string\\", \\"unix\\" or \\"verbose\\".

			    --custom-formatter

			      Path to a JS file exporting a custom formatting function.

			    --quiet, -q

			      Only register violations for rules with an \\"error\\"-level severity (ignore
			      \\"warning\\"-level).

			    --color
			    --no-color

			      Force enabling/disabling of color.

			    --report-needless-disables, --rd

			      Also report errors for stylelint-disable comments that are not blocking a lint warning.
			      The process will exit with code 2 if needless disables are found.

			    --report-invalid-scope-disables, --risd

			      Report stylelint-disable comments that used for rules that don't exist within the configuration object.
			      The process will exit with code 2 if invalid scope disables are found.

			    --max-warnings, --mw

			      Number of warnings above which the process will exit with code 2.
			      Useful when setting \\"defaultSeverity\\" to \\"warning\\" and expecting the
			      process to fail on warnings (e.g. CI build).

			    --output-file, -o

			      Path of file to write report.

			    --version, -v

			      Show the currently installed version of stylelint.

			    --allow-empty-input, --aei

			      When glob pattern matches no files, the process will exit without throwing an error.
			"
		`);
		});
	});

	it('--version', () => {
		return Promise.resolve(cli(['--version'])).then(() => {
			expect(process.exitCode).toBeUndefined();
			expect(console.log.mock.calls).toHaveLength(1);
			const lastCallArgs = console.log.mock.calls.pop();

			expect(lastCallArgs).toHaveLength(1);
			expect(lastCallArgs.pop()).toMatch(pkg.version);
		});
	});

	it('--print-config', () => {
		return Promise.resolve(
			cli([
				'--print-config',
				'--config',
				path.join(__dirname, 'config.json'),
				replaceBackslashes(path.join(__dirname, 'stylesheet.css')),
			]),
		).then(() => {
			expect(process.exitCode).toBeUndefined();
			expect(process.stdout.write).toHaveBeenCalledTimes(1);
			expect(process.stdout.write).toHaveBeenLastCalledWith(
				JSON.stringify(
					{
						rules: {
							'block-no-empty': [true],
						},
					},
					null,
					'  ',
				),
			);
		});
	});

	it('--report-needless-disables', () => {
		return Promise.resolve(
			cli([
				'--report-needless-disables',
				'--config',
				path.join(__dirname, 'config.json'),
				replaceBackslashes(path.join(__dirname, 'stylesheet.css')),
			]),
		).then(() => {
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
	});
});
