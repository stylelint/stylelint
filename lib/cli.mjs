import { isAbsolute, join, resolve } from 'node:path';
import { EOL } from 'node:os';
import { parseArgs } from 'node:util';
import process from 'node:process';
import { readFileSync } from 'node:fs';

import picocolors from 'picocolors';
const { cyan, dim, red } = picocolors;

import { isBoolean, isNumber, isObject, isPlainObject, isString } from './utils/validateTypes.mjs';
import checkInvalidCLIOptions from './utils/checkInvalidCLIOptions.mjs';
import dynamicImport from './utils/dynamicImport.mjs';
import omitPrivateProperties from './utils/omitPrivateProperties.mjs';
import pathExists from './utils/pathExists.mjs';
import printConfig from './printConfig.mjs';
import resolveSilent from './utils/resolveSilent.mjs';
import standalone from './standalone.mjs';
import writeOutputFile from './writeOutputFile.mjs';

import {
	DEFAULT_CACHE_LOCATION,
	DEFAULT_FORMATTER,
	DEFAULT_IGNORE_FILENAME,
	DEFAULT_SUPPRESSION_FILENAME,
	EXIT_CODE_FATAL_ERROR,
	EXIT_CODE_INVALID_USAGE,
	EXIT_CODE_LINT_PROBLEM,
} from './constants.mjs';
import normalizeFixMode from './utils/normalizeFixMode.mjs';

/** @import { ParseArgsConfig } from 'node:util' */

/** @typedef {NonNullable<ParseArgsConfig['options']>[string]} ParseArgsOption */

const helpText = `
  Usage: stylelint [input] [options]

  Input: Files(s), glob(s), or nothing to use stdin.

    If an input argument is wrapped in quotation marks, it will be passed to
    globby for cross-platform glob support. "node_modules" are always ignored.
    You can also pass no input and use stdin, instead.

  Options:

    -c <path_or_module>, --config=<path_or_module>

      A path to a specific configuration file (JSON, YAML, CommonJS, or ES module),
      or a module name in "node_modules" that points to one. If no argument is
      provided, Stylelint will search for configuration files in the following
      places, in this order:

        - a "stylelint" property in "package.json"
        - a ".stylelintrc" file
        - a ".stylelintrc.{cjs,mjs,js,ts,json,yaml,yml}" file
        - a "stylelint.config.{cjs,mjs,js,ts}" file

      The search will begin in the working directory and move up the directory
      tree until a configuration file is found.

    --config-basedir=<path>

      An absolute path to the directory that relative paths defining "extends",
      "plugins", and "customSyntax" are *relative to*. Only necessary if these
      values are relative paths.

    --print-config

      Print the configuration for the given input file path. Globs are unsupported.

    -i <path>, --ignore-path=<path>

      A path to a file containing patterns that describe files to ignore. The
      path can be absolute or relative to "process.cwd()". You can repeat the
      option to provide multiple paths. By default, Stylelint looks for
      "${DEFAULT_IGNORE_FILENAME}" in "process.cwd()". Multiple can be set.

    --ignore-pattern=<pattern>

      A pattern of files to ignore (in addition to those in "${DEFAULT_IGNORE_FILENAME}").
      Multiple can be set.

    --fix[=<mode>]

      Automatically fix problems of certain rules. The modes are as follows:

        strict       only fixing when there are no syntax errors (default)
        lax          attempting to fix as much as possible even with syntax errors

    --compute-edit-info

      Compute edit information for fixable problems.

    --custom-syntax=<name_or_path>

      A module name or path to a JS file exporting a PostCSS-compatible syntax.

    --stdin

      Accept stdin input even if it is empty.

    --stdin-filename=<name>

      A filename to assign stdin input.

    --ignore-disables

      Ignore "stylelint-disable" comments.

    --disable-default-ignores

      Allow linting of "node_modules".

    --[no-]cache

      Store the info about processed files in order to only operate on the
      changed ones the next time you run Stylelint. By default, the cache is
      stored in "${DEFAULT_CACHE_LOCATION}". To adjust this, use "--cache-location".
      Cache is disabled by default.

    --cache-location=<path>

      A path to a file or directory to be used for the cache location. If a
      directory is specified, a cache file will be created inside the specified
      folder, with a name derived from a hash of the current working directory.

      If the directory for the cache does not exist, make sure you add a trailing "/"
      on *nix systems or "\\" on Windows. Otherwise the path will be assumed to
      be a file.

    --cache-strategy=<strategy>

      A strategy for the cache to use for detecting changed files. Either one of:

        metadata     by metadata of a file (default)
        content      by content of a file

      The "content" strategy can be useful in cases where the modification time
      of your files changes even if their contents have not. For example, this can
      happen during git operations like "git clone" because git does not track file
      modification time.

    -f <formatter>, --formatter=<formatter>

      An output formatter. The variants are as follows:

        string       human-readable strings (default)
        compact      similar to ESLint's compact formatter
        json         JSON format
        tap          TAP format
        unix         C compiler-like format
        verbose      extend "string" to include a file list and a tally

    --custom-formatter=<path_or_module>

      A path to a JS file or module name exporting a custom formatting function.

    -q, --quiet

      Only register problems for rules with an "error"-level severity (ignore
      "warning"-level).

    --quiet-deprecation-warnings

      Ignore deprecations warnings.

    --[no-]color

      Force enabling/disabling of color.

    --[no-]validate

      Force enable/disable the validation of the rules' options.

    --report-needless-disables

      Also report errors for "stylelint-disable" comments that are not blocking
      a lint warning. The process will exit with code ${EXIT_CODE_LINT_PROBLEM} if needless disables are found.

    --report-invalid-scope-disables

      Report "stylelint-disable" comments that used for rules that don't exist
      within the configuration object. The process will exit with code ${EXIT_CODE_LINT_PROBLEM} if invalid
      scope disables are found.

    --report-descriptionless-disables

      Report "stylelint-disable" comments without a description. The process will
      exit with code ${EXIT_CODE_LINT_PROBLEM} if descriptionless disables are found.

    --max-warnings=<number>

      The number of warnings above which the process will exit with code ${EXIT_CODE_LINT_PROBLEM}.
      Useful when setting "defaultSeverity" to "warning" and expecting the process
      to fail on warnings (e.g. CI build).

    -o <path>, --output-file=<path>

      A file path to write a report.

    --allow-empty-input

      When a glob pattern matches no files, the process will exit without throwing an error.

    --suppress[=<rule>]

      Suppress problems and record them in a file. If no rule is specified,
      all problems are suppressed. Otherwise, only problems with the given
      rules are suppressed, e.g., "--suppress=rule1 --suppress=rule2".
      See also "--suppress-location".

    --suppress-location=<path>

      A path to a file or directory to be used for the suppressions file location. If a
      directory is specified, a suppressions file will be created inside the specified
      folder, with the name "${DEFAULT_SUPPRESSION_FILENAME}".

    --globby-options=<json>

      Options in JSON format passed to globby.

    -v, --version

      Show the version.

    -h, --help

      Show the help.
`;

/**
 * @typedef {object} Flag
 * @property {'boolean' | 'number' | 'string'} type
 * @property {string} [short] A one-character alias, e.g. `-c`.
 * @property {boolean} [multiple] Whether the flag can repeat. Its values collect into an array, which is empty when the flag is unspecified.
 * @property {boolean} [optionalValue] Whether the value can be omitted, as in `--fix[=<mode>]`.
 * @property {boolean} [default] A flag without a default is absent when unspecified, so that the config property applies.
 */

/**
 * The flags the command line accepts, keyed by option name.
 * @satisfies {Record<string, Flag>}
 */
const flags = {
	'allow-empty-input': {
		type: 'boolean',
	},
	cache: {
		type: 'boolean',
	},
	'cache-location': {
		type: 'string',
	},
	'cache-strategy': {
		type: 'string',
	},
	color: {
		type: 'boolean',
	},
	'compute-edit-info': {
		type: 'boolean',
		default: false,
	},
	config: {
		short: 'c',
		type: 'string',
	},
	'config-basedir': {
		type: 'string',
	},
	'custom-formatter': {
		type: 'string',
	},
	'custom-syntax': {
		type: 'string',
	},
	'disable-default-ignores': {
		type: 'boolean',
	},
	fix: {
		type: 'string',
		optionalValue: true,
	},
	formatter: {
		short: 'f',
		type: 'string',
	},
	'globby-options': {
		type: 'string',
	},
	help: {
		short: 'h',
		type: 'boolean',
	},
	'ignore-disables': {
		type: 'boolean',
	},
	'ignore-path': {
		short: 'i',
		type: 'string',
		multiple: true,
	},
	'ignore-pattern': {
		type: 'string',
		multiple: true,
	},
	'max-warnings': {
		type: 'number',
	},
	'output-file': {
		short: 'o',
		type: 'string',
	},
	'print-config': {
		type: 'boolean',
	},
	quiet: {
		short: 'q',
		type: 'boolean',
	},
	'quiet-deprecation-warnings': {
		type: 'boolean',
	},
	'report-descriptionless-disables': {
		type: 'boolean',
	},
	'report-invalid-scope-disables': {
		type: 'boolean',
	},
	'report-needless-disables': {
		type: 'boolean',
	},
	'report-unscoped-disables': {
		type: 'boolean',
	},
	stdin: {
		type: 'boolean',
	},
	'stdin-filename': {
		type: 'string',
	},
	suppress: {
		type: 'string',
		multiple: true,
		optionalValue: true,
	},
	'suppress-location': {
		type: 'string',
	},
	validate: {
		type: 'boolean',
		default: true,
	},
	version: {
		short: 'v',
		type: 'boolean',
	},
};

/** @type {Record<string, ParseArgsOption>} */
const parseArgsOptions = Object.fromEntries(
	Object.entries(flags).map(([option, flag]) => [option, buildParseArgsOption(flag)]),
);

/**
 * The option to use instead of each alias removed in 18.0.0, so that the invalid-option message can name it.
 * @type {Map<string, keyof typeof flags>}
 */
const optionNamesByRemovedAlias = new Map([
	['aei', 'allow-empty-input'],
	['cei', 'compute-edit-info'],
	['di', 'disable-default-ignores'],
	['go', 'globby-options'],
	['id', 'ignore-disables'],
	['ip', 'ignore-pattern'],
	['mw', 'max-warnings'],
	['rd', 'report-needless-disables'],
	['rdd', 'report-descriptionless-disables'],
	['risd', 'report-invalid-scope-disables'],
	['rud', 'report-unscoped-disables'],
]);

/**
 * @param {string[]} argv
 * @returns {Promise<void>}
 */
export default async function main(argv) {
	const cli = buildCLI(argv);

	// parseArgs follows POSIX, which reads `-o=report.json` as the path `=report.json`.
	const shortFlagWithEquals = argv.find(isShortFlagWithEquals);

	if (shortFlagWithEquals) {
		const suggestion = `${shortFlagWithEquals.slice(0, 2)} ${shortFlagWithEquals.slice(3)}`;

		process.stderr.write(
			`Invalid option ${red(`"${shortFlagWithEquals}"`)}. Did you mean ${cyan(`"${suggestion}"`)}?${EOL}`,
		);
		process.exitCode = EXIT_CODE_INVALID_USAGE;

		return;
	}

	const invalidOptionsMessage = checkInvalidCLIOptions(
		Object.keys(flags),
		cli.optionNames,
		optionNamesByRemovedAlias,
	);

	if (invalidOptionsMessage) {
		process.stderr.write(invalidOptionsMessage);
		process.exitCode = EXIT_CODE_INVALID_USAGE;

		return;
	}

	const {
		// Sort alphabetically
		'allow-empty-input': allowEmptyInput,
		cache,
		'cache-location': cacheLocation,
		'cache-strategy': cacheStrategy,
		'compute-edit-info': computeEditInfo,
		config: configFile,
		'config-basedir': configBasedir,
		'custom-formatter': customFormatter,
		'custom-syntax': customSyntax,
		'disable-default-ignores': disableDefaultIgnores,
		formatter: formatterInput,
		fix,
		'globby-options': globbyOptions,
		help,
		'ignore-disables': ignoreDisables,
		'ignore-path': ignorePath,
		'ignore-pattern': ignorePattern,
		'max-warnings': maxWarnings,
		'output-file': outputFile,
		'print-config': printConfigFlag,
		quiet,
		'quiet-deprecation-warnings': quietDeprecationWarnings,
		'report-descriptionless-disables': reportDescriptionlessDisables,
		'report-invalid-scope-disables': reportInvalidScopeDisables,
		'report-needless-disables': reportNeedlessDisables,
		'report-unscoped-disables': reportUnscopedDisables,
		stdin,
		'stdin-filename': stdinFilename,
		suppress,
		'suppress-location': suppressLocation,
		validate,
		version,
	} = cli.flags;

	if (help) {
		showHelp();

		return;
	}

	if (version) {
		process.stdout.write(`${getPackageJSON().version}${EOL}`);

		return;
	}

	let formatter = undefined;

	if (isString(customFormatter)) {
		formatter = await importCustomFormatter(customFormatter);
	} else if (isString(formatterInput)) {
		formatter = /** @type {import('stylelint').FormatterType} */ (formatterInput);
	}

	/** @type {import('stylelint').LinterOptions} */
	const options = {
		formatter,
		_defaultFormatter: DEFAULT_FORMATTER,
	};

	if (isBoolean(quiet)) {
		options.quiet = quiet;
	}

	if (isBoolean(quietDeprecationWarnings)) {
		options.quietDeprecationWarnings = quietDeprecationWarnings;
	}

	if (isString(customSyntax)) {
		options.customSyntax = customSyntax;
	}

	const cwd = process.cwd();

	if (isString(configFile)) {
		// Should check these possibilities:
		//   a. name of a node_module
		//   b. absolute path
		//   c. relative path relative to `process.cwd()`.
		// If none of the above work, we'll try a relative path starting
		// in `process.cwd()`.
		options.configFile = resolveSilent(cwd, configFile) || join(cwd, configFile);
	}

	if (isString(configBasedir)) {
		options.configBasedir = isAbsolute(configBasedir) ? configBasedir : resolve(cwd, configBasedir);
	}

	if (isString(globbyOptions)) {
		try {
			options.globbyOptions = await parseGlobbyOptions(globbyOptions);
		} catch (error) {
			if (typeof error === 'string') {
				process.stderr.write(`${error}${EOL}`);
				process.exitCode = EXIT_CODE_INVALID_USAGE;

				return;
			}

			throw error;
		}
	}

	if (isString(stdinFilename)) {
		options.codeFilename = stdinFilename;
	}

	if (Array.isArray(ignorePath)) {
		options.ignorePath = ignorePath;
	}

	if (Array.isArray(ignorePattern)) {
		options.ignorePattern = ignorePattern;
	}

	if (isBoolean(ignoreDisables)) {
		options.ignoreDisables = ignoreDisables;
	}

	if (isBoolean(disableDefaultIgnores)) {
		options.disableDefaultIgnores = disableDefaultIgnores;
	}

	if (isBoolean(cache)) {
		options.cache = cache;
	}

	if (isString(cacheLocation)) {
		options.cacheLocation = cacheLocation;
	}

	if (isString(cacheStrategy)) {
		options.cacheStrategy = cacheStrategy;
	}

	if (isString(fix)) {
		options.fix = normalizeFixMode(fix);
	}

	if (isBoolean(validate)) {
		options.validate = validate;
	}

	if (isBoolean(reportNeedlessDisables)) {
		options.reportNeedlessDisables = reportNeedlessDisables;
	}

	if (isBoolean(reportInvalidScopeDisables)) {
		options.reportInvalidScopeDisables = reportInvalidScopeDisables;
	}

	if (isBoolean(reportDescriptionlessDisables)) {
		options.reportDescriptionlessDisables = reportDescriptionlessDisables;
	}

	if (isBoolean(reportUnscopedDisables)) {
		options.reportUnscopedDisables = reportUnscopedDisables;
	}

	if (isNumber(maxWarnings)) {
		options.maxWarnings = maxWarnings;
	}

	if (isBoolean(allowEmptyInput)) {
		options.allowEmptyInput = allowEmptyInput;
	}

	if (isBoolean(computeEditInfo)) {
		options.computeEditInfo = computeEditInfo;
	}

	// A bare `--suppress` parses as the empty string and suppresses all problems; `--suppress=<rule>` suppresses those of the rule.
	if (Array.isArray(suppress)) {
		if (suppress.includes('')) {
			options.suppressAll = true;
		}

		const suppressRule = suppress.filter((rule) => rule !== '');

		if (suppressRule.length > 0) {
			options.suppressRule = suppressRule;
		}
	}

	if (isString(suppressLocation)) {
		options.suppressLocation = suppressLocation;
	}

	if (options.suppressAll && options.suppressRule) {
		process.stderr.write(
			`${red('Error: The --suppress and --suppress=<rule> options cannot be used together.')}${EOL}`,
		);
		process.exitCode = EXIT_CODE_INVALID_USAGE;

		return;
	}

	// Add input/code into options
	if (cli.input.length > 0) {
		options.files = cli.input;
	} else {
		options.code = await getStdin();
	}

	const hasStdin = stdin || isString(options.code);

	if (hasStdin && (options.suppressAll || options.suppressRule)) {
		process.stderr.write(
			`${red(
				'Error: The --suppress and --suppress=<rule> options cannot be used with piped-in code.',
			)}${EOL}`,
		);
		process.exitCode = EXIT_CODE_INVALID_USAGE;

		return;
	}

	if (printConfigFlag) {
		await printConfig(options)
			.then((config) => {
				process.stdout.write(JSON.stringify(config, omitPrivateProperties, 2));
			})
			.catch(handleError);

		return;
	}

	if (!options.files && !isString(options.code) && !stdin) {
		showHelp();

		return;
	}

	return standalone(options)
		.then(({ report, code, errored, maxWarningsExceeded }) => {
			if (!report && !code) {
				return;
			}

			if (code) {
				process.stdout.write(code);
			}

			if (report) {
				process.stderr.write(report);
			}

			if (isString(outputFile)) {
				writeOutputFile(report, outputFile).catch(handleError);
			}

			if (errored) {
				process.exitCode = EXIT_CODE_LINT_PROBLEM;
			} else if (isNumber(maxWarnings) && maxWarningsExceeded) {
				const foundWarnings = maxWarningsExceeded.foundWarnings;

				process.stderr.write(
					`${EOL}${red(`Max warnings exceeded: `)}${foundWarnings} found. ${dim(
						`${maxWarnings} allowed${EOL}${EOL}`,
					)}`,
				);
				process.exitCode = EXIT_CODE_LINT_PROBLEM;
			}
		})
		.catch(handleError);
}

/**
 * @param {unknown} err
 * @returns {void}
 */
function handleError(err) {
	if (!isObject(err)) {
		throw err;
	}

	if ('stack' in err && isString(err.stack)) {
		process.stderr.write(err.stack + EOL);
	}

	const exitCode = 'code' in err && isNumber(err.code) ? err.code : EXIT_CODE_FATAL_ERROR;

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
	} catch {
		return Promise.reject(errorMessage());
	}

	if (isPlainObject(options)) {
		return Promise.resolve(options);
	}

	return Promise.reject(errorMessage());
}

/**
 * @returns {Promise<string | undefined>}
 */
async function getStdin() {
	const { stdin } = process;

	if (stdin.isTTY) {
		return undefined;
	}

	const chunks = [];

	for await (const chunk of stdin) {
		chunks.push(chunk);
	}

	return Buffer.concat(chunks).toString();
}

/**
 * @param {string} fileOrModulePath
 * @returns {Promise<import('stylelint').Formatter>}
 */
async function importCustomFormatter(fileOrModulePath) {
	let modulePath = fileOrModulePath;

	if (await pathExists(modulePath)) {
		modulePath = resolve(modulePath); // to absolute path
	}

	return dynamicImport(modulePath).then((m) => m.default);
}

/**
 * @returns {void}
 */
function showHelp() {
	process.stdout.write(`\n  ${getPackageJSON().description}\n${helpText}`);
}

/**
 * @returns {{ description: string, version: string }}
 */
function getPackageJSON() {
	return JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
}

/**
 * @param {string} arg
 * @returns {boolean}
 */
function isShortFlagWithEquals(arg) {
	return /^-[a-z]=/i.test(arg);
}

/**
 * @param {Flag} flag
 * @returns {ParseArgsOption}
 */
function buildParseArgsOption(flag) {
	return {
		// A flag with an optional value is declared boolean, as a string option would take the next argument as its value.
		type: flag.type === 'boolean' || flag.optionalValue ? 'boolean' : 'string',
		...(flag.multiple && { multiple: true }),
		...(isString(flag.short) && { short: flag.short }),
	};
}

/**
 * @param {Flag} flag
 * @param {string | boolean | (string | boolean)[] | undefined} value The value parseArgs holds for the flag, if any.
 * @returns {string | number | boolean | string[] | undefined}
 */
function normalizeFlagValue(flag, value) {
	if (value === undefined) {
		return flag.multiple ? [] : flag.default;
	}

	if (Array.isArray(value)) {
		return value.map((entry) => normalizeFlagValue(flag, entry)).filter(isString);
	}

	if (flag.type === 'boolean') {
		// `--cache=false`
		return isString(value) ? value !== 'false' : value;
	}

	if (value === true) {
		// A flag given without a value has the empty string when its value is optional, as in a bare `--fix`, and no value otherwise.
		return flag.optionalValue ? '' : undefined;
	}

	return flag.type === 'number' && isString(value) ? Number(value) : value;
}

/**
 * @param {string[]} argv
 * @returns {{ flags: Partial<Record<keyof typeof flags, unknown>>, input: string[], optionNames: string[] }}
 */
export function buildCLI(argv) {
	const { values, positionals } = parseArgs({
		args: argv,
		options: parseArgsOptions,
		strict: false, // Unknown flags are reported by `checkInvalidCLIOptions()` instead
		allowPositionals: true,
		allowNegative: true,
	});

	/** @type {Partial<Record<keyof typeof flags, unknown>>} */
	const parsedFlags = Object.fromEntries(
		Object.entries(flags)
			.map(([option, flag]) => [option, normalizeFlagValue(flag, values[option])])
			.filter(([, value]) => value !== undefined),
	);

	return { flags: parsedFlags, input: positionals, optionNames: Object.keys(values) };
}
