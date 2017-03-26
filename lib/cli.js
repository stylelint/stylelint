#!/usr/bin/env node
/* @flow */
"use strict"
const getModulePath = require("./utils/getModulePath")
const getStdin = require("get-stdin")
const meow = require("meow")
const needlessDisablesStringFormatter = require("./formatters/needlessDisablesStringFormatter")
const path = require("path")
const resolveFrom = require("resolve-from")
const standalone = require("./standalone")
const dynamicRequire = require("./dynamicRequire")

const minimistOptions = {
  default: {
    config: false,
    f: "string",
    q: false,
  },
  alias: {
    f: "formatter",
    h: "help",
    i: "ignore-path",
    id: "ignore-disables",
    q: "quiet",
    rd: "report-needless-disables",
    s: "syntax",
    v: "version",
    aei: "allow-empty-input",
  },
  boolean: [
    "allow-empty-input",
    "color",
    "help",
    "ignore-disables",
    "no-color",
    "quiet",
    "version",
  ],
}

const meowOptions = {
  help: `
    Usage: stylelint [input] [options]

    Input: Files(s), glob(s), or nothing to use stdin.

      If an input argument is wrapped in quotation marks, it will be passed to
      node-glob for cross-platform glob support. node_modules and
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

      --ignore-path, -i

        Path to a file containing patterns that describe files to ignore. The
        path can be absolute or relative to process.cwd(). By default, stylelint
        looks for .stylelintignore in process.cwd().

      --syntax, -s

        Specify a non-standard syntax. Options: "scss", "less", "sugarss".
        If you do not specify a syntax, non-standard syntaxes will be
        automatically inferred by the file extensions .scss, .less, and .sss.

      --custom-syntax

        Module name or path to a JS file exporting a PostCSS-compatible syntax.

      --stdin-filename

        A filename to assign stdin input.

      --ignore-disables, --id

        Ignore styleline-disable comments.
        
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
        on \*nix systems or "\" on Windows. Otherwise the path will be assumed to be a file.
         

      --formatter, -f               [default: "string"]

        The output formatter: "json", "string" or "verbose".

      --custom-formatter

        Path to a JS file exporting a custom formatting function.

      --quiet, -q

        Only register warnings for rules with an "error"-level severity (ignore
        "warning"-level).

      --color
      --no-color

        Force enabling/disabling of color.

      --allow-empty-input, -aei

        If no files match glob pattern, exits without throwing an error.

      --report-needless-disables, --rd

        Report stylelint-disable comments that are not blocking a lint warning.
        If you provide the argument "error", the process will exit with code 2
        if needless disables are found.

      --version, -v

        Show the currently installed version of stylelint.
  `,
  pkg: "../package.json",
}

const cli = meow(meowOptions, minimistOptions)

let formatter = cli.flags.formatter
if (cli.flags.customFormatter) {
  const customFormatter = path.isAbsolute(cli.flags.customFormatter) ? cli.flags.customFormatter : path.join(process.cwd(), cli.flags.customFormatter)
  formatter = dynamicRequire(customFormatter)
}

const optionsBase/*: Object*/ = {
  formatter,
  configOverrides: {},
}

if (cli.flags.quiet) {
  optionsBase.configOverrides.quiet = cli.flags.quiet
}

if (cli.flags.syntax) {
  optionsBase.syntax = cli.flags.syntax
}

if (cli.flags.customSyntax) {
  optionsBase.customSyntax = getModulePath(process.cwd(), cli.flags.customSyntax)
}

if (cli.flags.config) {
  // Should check these possibilities:
  //   a. name of a node_module
  //   b. absolute path
  //   c. relative path relative to `process.cwd()`.
  // If none of the above work, we'll try a relative path starting
  // in `process.cwd()`.
  optionsBase.configFile = resolveFrom(process.cwd(), cli.flags.config) || path.join(process.cwd(), cli.flags.config)
}

if (cli.flags.configBasedir) {
  optionsBase.configBasedir = path.isAbsolute(cli.flags.configBasedir) ? cli.flags.configBasedir : path.resolve(process.cwd(), cli.flags.configBasedir)
}

if (cli.flags.stdinFilename) {
  optionsBase.codeFilename = cli.flags.stdinFilename
}

if (cli.flags.ignorePath) {
  optionsBase.ignorePath = cli.flags.ignorePath
}

if (cli.flags.ignoreDisables) {
  optionsBase.ignoreDisables = cli.flags.ignoreDisables
}

if (cli.flags.allowEmptyInput) {
  optionsBase.allowEmptyInput = cli.flags.allowEmptyInput
}

if (cli.flags.cache) {
  optionsBase.cache = true
}

if (cli.flags.cacheLocation) {
  optionsBase.cacheLocation = cli.flags.cacheLocation
}

const reportNeedlessDisables = cli.flags.reportNeedlessDisables

if (reportNeedlessDisables) {
  optionsBase.reportNeedlessDisables = reportNeedlessDisables
}

Promise.resolve().then(() => {
  // Add input/code into options
  if (cli.input.length) {
    return Object.assign({}, optionsBase, {
      files: cli.input,
    })
  }
  return getStdin().then(stdin => Object.assign({}, optionsBase, {
    code: stdin,
  }))
}).then(options => {
  if (!options.files && !options.code) {
    cli.showHelp()
  }

  return standalone(options)
}).then((linted) => {
  if (reportNeedlessDisables) {
    process.stdout.write(needlessDisablesStringFormatter(linted.needlessDisables))
    if (reportNeedlessDisables === "error") {
      process.exitCode = 2
    }
    return
  }

  if (!linted.output) {
    return
  }
  process.stdout.write(linted.output)
  if (linted.errored) {
    process.exitCode = 2
  }
}).catch(err => {
  console.log(err.stack) // eslint-disable-line no-console
  const exitCode = typeof err.code === "number" ? err.code : 1
  process.exit(exitCode)
})
