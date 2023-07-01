'use strict';

const { EOL } = require('os');
const meow = require('meow');
const path = require('path');
const { red, dim } = require('picocolors');
const resolveFrom = require('resolve-from');

const { isPlainObject } = require('./utils/validateTypes');
const checkInvalidCLIOptions = require('./utils/checkInvalidCLIOptions');
const printConfig = require('./printConfig');
const standalone = require('./standalone');
const writeOutputFile = require('./writeOutputFile');
const resolveCustomFormatter = require('./resolveCustomFormatter');
const {
	DEFAULT_CACHE_LOCATION,
	DEFAULT_IGNORE_FILENAME,
	DEFAULT_FORMATTER,
	EXIT_CODE_ERROR,
} = require('./constants');

/**
 * @typedef {{
 *   allowEmptyInput: boolean;
 *   cache: boolean;
 *   cacheLocation?: string;
 *   cacheStrategy?: string;
 *   color: boolean;
 *   config?: string;
 *   configBasedir?: string;
 *   customFormatter?: string;
 *   customSyntax?: string;
 *   disableDefaultIgnores: boolean;
 *   fix: boolean;
 *   formatter: string;
 *   globbyOptions?: string;
 *   help: boolean;
 *   ignoreDisables: boolean;
 *   ignorePath: string[];
 *   ignorePattern: string[];
 *   maxWarnings?: number;
 *   outputFile?: string;
 *   printConfig: boolean;
 *   quiet: boolean;
 *   quietDeprecationWarnings: boolean;
 *   reportDescriptionlessDisables: boolean;
 *   reportInvalidScopeDisables: boolean;
 *   reportNeedlessDisables: boolean;
 *   stdin: boolean;
 *   stdinFilename?: string;
 *   version: boolean;
 * }} CLIFlags
 */

/**
 * @typedef {{
 *   input: string[];
 *   showHelp: (code: number) => void;
 *   showVersion: () => void;
 *   flags: CLIFlags;
 * }} CLIOptions
 */

/**
 * @typedef {{
 *   allowEmptyInput?: boolean;
 *   cache?: boolean;
 *   cacheLocation?: string;
 *   cacheStrategy?: string;
 *   code?: string;
 *   codeFilename?: string;
 *   configFile?: string;
 *   configBasedir?: string;
 *   customSyntax?: string;
 *   disableDefaultIgnores?: boolean;
 *   files?: string[];
 *   fix?: boolean;
 *   formatter: any;
 *   globbyOptions?: Record<string, unknown>;
 *   ignoreDisables?: boolean;
 *   ignorePath?: string[];
 *   ignorePattern?: string[];
 *   maxWarnings?: number;
 *   outputFile?: string;
 *   quiet?: boolean;
 *   quietDeprecationWarnings?: boolean;
 *   reportDescriptionlessDisables?: boolean;
 *   reportInvalidScopeDisables?: boolean;
 *   reportNeedlessDisables?: boolean;
 * }} OptionBaseType
 */

const meowOptions = {
	autoHelp: false,
	autoVersion: false,
	help: `
    Usage: stylelint [input] [options]

    Input: Files(s), glob(s), or nothing to use stdin.

      If an input argument is wrapped in quotation marks, it will be passed to
      globby for cross-platform glob support. "node_modules" are always ignored.
      You can also pass no input and use stdin, instead.

    Options:

      --config, -c <path_or_module>

        A path to a specific configuration file (JSON, YAML, CommonJS, or ES module),
        or a module name in "node_modules" that points to one. If no argument is
        provided, Stylelint will search for configuration files in the following
        places, in this order:

          - a "stylelint" property in "package.json"
          - a ".stylelintrc" file
          - a ".stylelintrc.{cjs,mjs,js,json,yaml,yml}" file
          - a "stylelint.config.{cjs,mjs,js}" file

        The search will begin in the working directory and move up the directory
        tree until a configuration file is found.

      --config-basedir <path>

        An absolute path to the directory that relative paths defining "extends",
        "plugins", and "customSyntax" are *relative to*. Only necessary if these
        values are relative paths.

      --print-config

        Print the configuration for the given input file path. Globs are unsupported.

      --ignore-path, -i <path>

        A path to a file containing patterns that describe files to ignore. The
        path can be absolute or relative to "process.cwd()". You can repeat the
        option to provide multiple paths. By default, Stylelint looks for
        "${DEFAULT_IGNORE_FILENAME}" in "process.cwd()". Multiple can be set.

      --ignore-pattern, --ip <pattern>

        A pattern of files to ignore (in addition to those in "${DEFAULT_IGNORE_FILENAME}").
        Multiple can be set.

      --fix

        Automatically fix problems of certain rules.

      --custom-syntax <name_or_path>

        A module name or path to a JS file exporting a PostCSS-compatible syntax.

      --stdin

        Accept stdin input even if it is empty.

      --stdin-filename <name>

        A filename to assign stdin input.

      --ignore-disables, --id

        Ignore "stylelint-disable" comments.

      --disable-default-ignores, --di

        Allow linting of "node_modules".

      --[no-]cache

        Store the info about processed files in order to only operate on the
        changed ones the next time you run Stylelint. By default, the cache is
        stored in "${DEFAULT_CACHE_LOCATION}". To adjust this, use "--cache-location".
        Cache is disabled by default.

      --cache-location <path>

        A path to a file or directory to be used for the cache location. If a
        directory is specified, a cache file will be created inside the specified
        folder, with a name derived from a hash of the current working directory.

        If the directory for the cache does not exist, make sure you add a trailing "/"
        on *nix systems or "\\" on Windows. Otherwise the path will be assumed to
        be a file.

      --cache-strategy <strategy>

        A strategy for the cache to use for detecting changed files. Either one of:

          metadata     by metadata of a file (default)
          content      by content of a file

        The "content" strategy can be useful in cases where the modification time
        of your files changes even if their contents have not. For example, this can
        happen during git operations like "git clone" because git does not track file
        modification time.

      --formatter, -f <formatter>

        An output formatter. The variants are as follows:

          string       human-readable strings (default)
          compact      similar to ESLint's compact formatter
          github       workflow commands for GitHub Actions
          json         JSON format
          tap          TAP format
          unix         C compiler-like format
          verbose      extend "string" to include a file list and a tally

      --custom-formatter <path_or_module>

        A path to a JS file or module name exporting a custom formatting function.

      --quiet, -q

        Only register problems for rules with an "error"-level severity (ignore
        "warning"-level).

      --quiet-deprecation-warnings

        Ignore deprecations warnings.

      --[no-]color

        Force enabling/disabling of color.

      --report-needless-disables, --rd

        Also report errors for "stylelint-disable" comments that are not blocking
        a lint warning. The process will exit with code ${EXIT_CODE_ERROR} if needless disables are found.

      --report-invalid-scope-disables, --risd

        Report "stylelint-disable" comments that used for rules that don't exist
        within the configuration object. The process will exit with code ${EXIT_CODE_ERROR} if invalid
        scope disables are found.

      --report-descriptionless-disables, --rdd

        Report "stylelint-disable" comments without a description. The process will
        exit with code ${EXIT_CODE_ERROR} if descriptionless disables are found.

      --max-warnings, --mw <number>

        The number of warnings above which the process will exit with code ${EXIT_CODE_ERROR}.
        Useful when setting "defaultSeverity" to "warning" and expecting the process
        to fail on warnings (e.g. CI build).

      --output-file, -o <path>

        A file path to write a report.

      --allow-empty-input, --aei

        When a glob pattern matches no files, the process will exit without throwing an error.

      --globby-options, --go <json>

        Options in JSON format passed to globby.

      --version, -v

        Show the version.

      --help, -h

        Show the help.
	`,
	flags: {
		allowEmptyInput: {
			alias: 'aei',
			type: 'boolean',
		},
		cache: {
			type: 'boolean',
		},
		cacheLocation: {
			type: 'string',
		},
		cacheStrategy: {
			type: 'string',
		},
		color: {
			type: 'boolean',
		},
		config: {
			alias: 'c',
			type: 'string',
		},
		configBasedir: {
			type: 'string',
		},
		customFormatter: {
			type: 'string',
		},
		customSyntax: {
			type: 'string',
		},
		disableDefaultIgnores: {
			alias: 'di',
			type: 'boolean',
		},
		fix: {
			type: 'boolean',
		},
		formatter: {
			alias: 'f',
			type: 'string',
			default: DEFAULT_FORMATTER,
		},
		globbyOptions: {
			alias: 'go',
			type: 'string',
		},
		help: {
			alias: 'h',
			type: 'boolean',
		},
		ignoreDisables: {
			alias: 'id',
			type: 'boolean',
		},
		ignorePath: {
			alias: 'i',
			type: 'string',
			isMultiple: true,
		},
		ignorePattern: {
			alias: 'ip',
			type: 'string',
			isMultiple: true,
		},
		maxWarnings: {
			alias: 'mw',
			type: 'number',
		},
		outputFile: {
			alias: 'o',
			type: 'string',
		},
		printConfig: {
			type: 'boolean',
		},
		quiet: {
			alias: 'q',
			type: 'boolean',
		},
		quietDeprecationWarnings: {
			type: 'boolean',
		},
		reportDescriptionlessDisables: {
			alias: 'rdd',
			type: 'boolean',
		},
		reportInvalidScopeDisables: {
			alias: 'risd',
			type: 'boolean',
		},
		reportNeedlessDisables: {
			alias: 'rd',
			type: 'boolean',
		},
		stdin: {
			type: 'boolean',
		},
		stdinFilename: {
			type: 'string',
		},
		version: {
			alias: 'v',
			type: 'boolean',
		},
	},
};

/**
 * @param {string[]} argv
 * @returns {Promise<any>}
 */
module.exports = async function main(argv) {
	const cli = buildCLI(argv);

	const invalidOptionsMessage = checkInvalidCLIOptions(meowOptions.flags, cli.flags);

	if (invalidOptionsMessage) {
		process.stderr.write(invalidOptionsMessage);
		process.exit(EXIT_CODE_ERROR); // eslint-disable-line n/no-process-exit
	}

	let formatter = cli.flags.formatter;

	if (cli.flags.customFormatter) {
		const customFormatter = resolveCustomFormatter(cli.flags.customFormatter);

		formatter = require(customFormatter);
	}

	/** @type {OptionBaseType} */
	const optionsBase = {
		formatter,
	};

	if (cli.flags.quiet) {
		optionsBase.quiet = cli.flags.quiet;
	}

	if (cli.flags.quietDeprecationWarnings) {
		optionsBase.quietDeprecationWarnings = cli.flags.quietDeprecationWarnings;
	}

	if (cli.flags.customSyntax) {
		optionsBase.customSyntax = cli.flags.customSyntax;
	}

	if (cli.flags.config) {
		// Should check these possibilities:
		//   a. name of a node_module
		//   b. absolute path
		//   c. relative path relative to `process.cwd()`.
		// If none of the above work, we'll try a relative path starting
		// in `process.cwd()`.
		optionsBase.configFile =
			resolveFrom.silent(process.cwd(), cli.flags.config) ||
			path.join(process.cwd(), cli.flags.config);
	}

	if (cli.flags.configBasedir) {
		optionsBase.configBasedir = path.isAbsolute(cli.flags.configBasedir)
			? cli.flags.configBasedir
			: path.resolve(process.cwd(), cli.flags.configBasedir);
	}

	if (cli.flags.globbyOptions) {
		try {
			optionsBase.globbyOptions = await parseGlobbyOptions(cli.flags.globbyOptions);
		} catch (error) {
			if (typeof error === 'string') {
				process.stderr.write(`${error}${EOL}`);
				process.exitCode = EXIT_CODE_ERROR;

				return;
			}

			throw error;
		}
	}

	if (cli.flags.stdinFilename) {
		optionsBase.codeFilename = cli.flags.stdinFilename;
	}

	if (cli.flags.ignorePath) {
		optionsBase.ignorePath = cli.flags.ignorePath;
	}

	if (cli.flags.ignorePattern) {
		optionsBase.ignorePattern = cli.flags.ignorePattern;
	}

	if (cli.flags.ignoreDisables) {
		optionsBase.ignoreDisables = cli.flags.ignoreDisables;
	}

	if (cli.flags.disableDefaultIgnores) {
		optionsBase.disableDefaultIgnores = cli.flags.disableDefaultIgnores;
	}

	if (cli.flags.cache) {
		optionsBase.cache = true;
	}

	if (cli.flags.cacheLocation) {
		optionsBase.cacheLocation = cli.flags.cacheLocation;
	}

	if (cli.flags.cacheStrategy) {
		optionsBase.cacheStrategy = cli.flags.cacheStrategy;
	}

	if (cli.flags.fix) {
		optionsBase.fix = cli.flags.fix;
	}

	if (cli.flags.outputFile) {
		optionsBase.outputFile = cli.flags.outputFile;
	}

	const reportNeedlessDisables = cli.flags.reportNeedlessDisables;
	const reportInvalidScopeDisables = cli.flags.reportInvalidScopeDisables;
	const reportDescriptionlessDisables = cli.flags.reportDescriptionlessDisables;

	if (reportNeedlessDisables) {
		optionsBase.reportNeedlessDisables = reportNeedlessDisables;
	}

	if (reportInvalidScopeDisables) {
		optionsBase.reportInvalidScopeDisables = reportInvalidScopeDisables;
	}

	if (reportDescriptionlessDisables) {
		optionsBase.reportDescriptionlessDisables = reportDescriptionlessDisables;
	}

	const maxWarnings = cli.flags.maxWarnings;

	if (maxWarnings !== undefined) {
		optionsBase.maxWarnings = maxWarnings;
	}

	if (cli.flags.help) {
		cli.showHelp(0);

		return;
	}

	if (cli.flags.version) {
		cli.showVersion();

		return;
	}

	if (cli.flags.allowEmptyInput) {
		optionsBase.allowEmptyInput = cli.flags.allowEmptyInput;
	}

	// Add input/code into options
	/** @type {OptionBaseType} */
	const options = cli.input.length
		? {
				...optionsBase,
				files: cli.input,
		  }
		: await getStdin().then((stdin) => ({
				...optionsBase,
				code: stdin,
		  }));

	if (cli.flags.printConfig) {
		return printConfig(options)
			.then((config) => {
				process.stdout.write(JSON.stringify(config, null, '  '));
			})
			.catch(handleError);
	}

	if (!options.files && !options.code && !cli.flags.stdin) {
		cli.showHelp(0);

		return;
	}

	return standalone(options)
		.then((linted) => {
			if (!linted.output) {
				return;
			}

			process.stdout.write(linted.output);

			if (options.outputFile) {
				writeOutputFile(linted.output, options.outputFile).catch(handleError);
			}

			if (linted.errored) {
				process.exitCode = EXIT_CODE_ERROR;
			} else if (maxWarnings !== undefined && linted.maxWarningsExceeded) {
				const foundWarnings = linted.maxWarningsExceeded.foundWarnings;

				process.stderr.write(
					`${EOL}${red(`Max warnings exceeded: `)}${foundWarnings} found. ${dim(
						`${maxWarnings} allowed${EOL}${EOL}`,
					)}`,
				);
				process.exitCode = EXIT_CODE_ERROR;
			}
		})
		.catch(handleError);
};

/**
 * @param {{ stack: any, code: any }} err
 * @returns {void}
 */
function handleError(err) {
	process.stderr.write(err.stack + EOL);
	const exitCode = typeof err.code === 'number' ? err.code : 1;

	process.exitCode = exitCode;
}

/**
 * @param {string} value
 * @returns {Promise<Record<string, unknown>>}
 */
function parseGlobbyOptions(value) {
	const errorMessage = () =>
		`Invalid option ${red('"--globby-options"')}.` +
		` The value ${red(`"${value}"`)} is not valid JSON object.`;

	let options;

	try {
		options = JSON.parse(value);
	} catch (_) {
		return Promise.reject(errorMessage());
	}

	if (isPlainObject(options)) {
		return Promise.resolve(options);
	}

	return Promise.reject(errorMessage());
}

/**
 * @returns {Promise<string>}
 */
async function getStdin() {
	const chunks = [];

	for await (const chunk of process.stdin) {
		chunks.push(chunk);
	}

	return Buffer.concat(chunks).toString();
}

/**
 * @param {string[]} argv
 * @returns {CLIOptions}
 */
function buildCLI(argv) {
	// @ts-expect-error -- TS2322: Type 'Result<AnyFlags>' is not assignable to type 'CLIOptions'.
	return meow({ ...meowOptions, argv });
}

module.exports.buildCLI = buildCLI;
