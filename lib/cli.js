/* @flow */
"use strict";

const chalk = require("chalk");
const checkInvalidCLIOptions = require("./utils/checkInvalidCLIOptions");
const dynamicRequire = require("./dynamicRequire");
const EOL = require("os").EOL;
const getFormatterOptionsText = require("./utils/getFormatterOptionsText");
const getModulePath = require("./utils/getModulePath");
const getStdin = require("get-stdin");
const meow = require("meow");
const needlessDisablesStringFormatter = require("./formatters/needlessDisablesStringFormatter");
const path = require("path");
const printConfig = require("./printConfig");
const resolveFrom = require("resolve-from");
const standalone = require("./standalone");

const EXIT_CODE_ERROR = 2;

/*:: type meowOptionsType = {
  argv?: string[],
  autoHelp: boolean,
  autoVersion: boolean,
  help: string,
  flags: {
    cache: {
      type: string
    },
    "cache-location": {
      type: string
    },
    config: {
      default: boolean,
      type: string
    },
    "config-basedir": {
      type: string
    },
    "print-config": {
      type: string
    },
    color: {
      type: string
    },
    "custom-formatter": {
      type: string
    },
    "custom-syntax": {
      type: string
    },
    "disable-default-ignores": {
      alias: string,
      type: string
    },
    fix: {
      type: string
    },
    formatter: {
      alias: string,
      default: "string",
      type: string
    },
    help: {
      alias: string,
      type: string
    },
    "ignore-disables": {
      alias: string,
      type: string
    },
    "ignore-path": {
      alias: string
    },
    "ignore-pattern": {
      alias: string
    },
    "no-color": {
      type: string
    },
    "report-needless-disables": {
      alias: string
    },
    "max-warnings": {
      alias: string
    },
    "stdin-filename": {
      type: string
    },
    quiet: {
      alias: string,
      type: string,
      default: boolean
    },
    syntax: {
      alias: string
    },
    version: {
      alias: string,
      type: string
    }
  },
  pkg: string,
} */

/*:: type cliType = {
  flags: {
    cache: any,
    cacheLocation: any,
    config: any,
    configBasedir: any,
    printConfig: boolean,
    customFormatter: any,
    customSyntax: any,
    disableDefaultIgnores: boolean,
    fix: any,
    formatter: any,
    h: boolean,
    help: boolean,
    ignoreDisables: boolean,
    ignorePath: string,
    ignorePattern: string,
    maxWarnings: number,
    quiet: any,
    reportNeedlessDisables: any,
    stdinFilename: any,
    syntax: any,
    v: string,
    version: string
  },
  input: any,
  help: any,
  pkg: any,
  showHelp: Function,
  showVersion: Function
}*/

/*:: type optionBaseType = {
  formater?: any,
  cache?: boolean,
  cacheLocation?: any,
  codeFilename?: any,
  configBasedir?: any,
  configFile?: any,
  configOverrides: {
    quiet?: any,
  },
  printConfig?: any,
  customSyntax?: any,
  fix?: any,
  ignoreDisables?: any,
  ignorePath?: any,
  reportNeedlessDisables?: any,
  maxWarnings?: any,
  syntax?: any,
  disableDefaultIgnores?: any,
  ignorePattern?: any
}*/

const meowOptions /*: meowOptionsType*/ = {
  autoHelp: false,
  autoVersion: false,
  help: `
    Usage: stylelint [input] [options]

    Input: Files(s), glob(s), or nothing to use stdin.

      If an input argument is wrapped in quotation marks, it will be passed to
      globby for cross-platform glob support. node_modules and
      bower_components are always ignored. You can also pass no input and use
      stdin, instead.

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

        An absolute path to the directory that relative paths defining "extends"
        and "plugins" are *relative to*. Only necessary if these values are
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

        Specify a non-standard syntax. Options: "scss", "sass", "less", "sugarss".
        If you do not specify a syntax, non-standard syntaxes will be
        automatically inferred by the file extensions .scss, .sass, .less, and .sss.

      --fix

        Automatically fix violations of certain rules.

      --custom-syntax

        Module name or path to a JS file exporting a PostCSS-compatible syntax.

      --stdin-filename

        A filename to assign stdin input.

      --ignore-disables, --id

        Ignore styleline-disable comments.

      --disable-default-ignores, --di

        Allow linting of node_modules and bower_components.

      --cache                       [default: false]

        Store the info about processed files in order to only operate on the
        changed ones the next time you run stylelint. By default, the cache
        is stored in "./.stylelintcache". To adjust this, use --cache-location.

      --cache-location              [default: '.stylelintcache']

        Path to a file or directory to be used for the cache location.
        Default is "./.stylelintcache". If a directory is specified, a cache
        file will be created inside the specified folder, with a name derived
        from a hash of the current working directory.

        If the directory for the cache does not exist, make sure you add a trailing "/"
        on *nix systems or "\\" on Windows. Otherwise the path will be assumed to be a file.

      --formatter, -f               [default: "string"]

        The output formatter: ${getFormatterOptionsText({ useOr: true })}.

      --custom-formatter

        Path to a JS file exporting a custom formatting function.

      --quiet, -q

        Only register warnings for rules with an "error"-level severity (ignore
        "warning"-level).

      --color
      --no-color

        Force enabling/disabling of color.

      --report-needless-disables, --rd

        Report stylelint-disable comments that are not blocking a lint warning.
        The process will exit with code ${EXIT_CODE_ERROR} if needless disables are found.

      --max-warnings, --mw

        Number of warnings above which the process will exit with code ${EXIT_CODE_ERROR}.
        Useful when setting "defaultSeverity" to "warning" and expecting the
        process to fail on warnings (e.g. CI build).

      --version, -v

        Show the currently installed version of stylelint.
  `,
  flags: {
    cache: {
      type: "boolean"
    },
    "cache-location": {
      type: "string"
    },
    config: {
      default: false,
      type: "string"
    },
    "config-basedir": {
      type: "string"
    },
    "print-config": {
      type: "boolean"
    },
    color: {
      type: "boolean"
    },
    "custom-formatter": {
      type: "string"
    },
    "custom-syntax": {
      type: "string"
    },
    "disable-default-ignores": {
      alias: "di",
      type: "boolean"
    },
    fix: {
      type: "boolean"
    },
    formatter: {
      alias: "f",
      default: "string",
      type: "string"
    },
    help: {
      alias: "h",
      type: "boolean"
    },
    "ignore-disables": {
      alias: "id",
      type: "boolean"
    },
    "ignore-path": {
      alias: "i"
    },
    "ignore-pattern": {
      alias: "ip"
    },
    "no-color": {
      type: "boolean"
    },
    "report-needless-disables": {
      alias: "rd"
    },
    "max-warnings": {
      alias: "mw"
    },
    "stdin-filename": {
      type: "string"
    },
    quiet: {
      alias: "q",
      type: "boolean",
      default: false
    },
    syntax: {
      alias: "s"
    },
    version: {
      alias: "v",
      type: "boolean"
    }
  },
  pkg: require("../package.json")
};

module.exports = (argv /*: string[]*/) /*: Promise<void>|void*/ => {
  meowOptions.argv = argv;
  const cli /*: cliType*/ = meow(meowOptions);

  const invalidOptionsMessage = checkInvalidCLIOptions(
    meowOptions.flags,
    cli.flags
  );
  if (invalidOptionsMessage) {
    process.stderr.write(invalidOptionsMessage);
    process.exit(EXIT_CODE_ERROR); // eslint-disable-line no-process-exit
  }

  let formatter = cli.flags.formatter;
  if (cli.flags.customFormatter) {
    const customFormatter = path.isAbsolute(cli.flags.customFormatter)
      ? cli.flags.customFormatter
      : path.join(process.cwd(), cli.flags.customFormatter);
    formatter = dynamicRequire(customFormatter);
  }

  const optionsBase /*: optionBaseType*/ = {
    formatter,
    configOverrides: {}
  };

  if (cli.flags.quiet) {
    optionsBase.configOverrides.quiet = cli.flags.quiet;
  }

  if (cli.flags.syntax) {
    optionsBase.syntax = cli.flags.syntax;
  }

  if (cli.flags.customSyntax) {
    optionsBase.customSyntax = getModulePath(
      process.cwd(),
      cli.flags.customSyntax
    );
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

  if (cli.flags.fix) {
    optionsBase.fix = cli.flags.fix;
  }

  const reportNeedlessDisables = cli.flags.reportNeedlessDisables;

  if (reportNeedlessDisables) {
    optionsBase.reportNeedlessDisables = reportNeedlessDisables;
  }

  const maxWarnings = cli.flags.maxWarnings;

  if (maxWarnings !== undefined) {
    optionsBase.maxWarnings = maxWarnings;
  }

  if (cli.flags.help || cli.flags.h) {
    cli.showHelp(0);
    return;
  }

  if (cli.flags.version || cli.flags.v) {
    cli.showVersion();
    return;
  }

  return Promise.resolve()
    .then(() => {
      // Add input/code into options
      if (cli.input.length) {
        return Object.assign({}, optionsBase, {
          files: cli.input
        });
      }
      return getStdin().then(stdin =>
        Object.assign({}, optionsBase, {
          code: stdin
        })
      );
    })
    .then(options => {
      if (cli.flags.printConfig) {
        return printConfig(options)
          .then(config => {
            process.stdout.write(JSON.stringify(config, null, "  "));
          })
          .catch(handleError);
      }

      if (!options.files && !options.code) {
        cli.showHelp();
        return;
      }

      return standalone(options)
        .then(linted => {
          if (reportNeedlessDisables) {
            const report = needlessDisablesStringFormatter(
              linted.needlessDisables
            );

            process.stdout.write(report);
            if (report) {
              process.exitCode = EXIT_CODE_ERROR;
            }
            return;
          }

          if (!linted.output) {
            return;
          }

          process.stdout.write(linted.output);

          if (linted.errored) {
            process.exitCode = EXIT_CODE_ERROR;
          } else if (maxWarnings !== undefined && linted.maxWarningsExceeded) {
            const foundWarnings = linted.maxWarningsExceeded.foundWarnings;

            process.stdout.write(
              chalk.red(`Max warnings exceeded: `) +
                `${foundWarnings} found. ` +
                chalk.dim(`${maxWarnings} allowed${EOL}${EOL}`)
            );
            process.exitCode = EXIT_CODE_ERROR;
          }
        })
        .catch(handleError);
    });
};

function handleError(err /*: { stack: any, code: any }*/) /*: void */ {
  console.log(err.stack); // eslint-disable-line no-console
  const exitCode = typeof err.code === "number" ? err.code : 1;
  process.exit(exitCode); // eslint-disable-line no-process-exit
}
