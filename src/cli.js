#!/usr/bin/env node

import meow from "meow"
import path from "path"
import { assign, includes } from "lodash"
import getStdin from "get-stdin"
import resolveFrom from "resolve-from"
import standalone from "./standalone"

const minimistOptions = {
  default: {
    config: false,
    f: "string",
    q: false,
    v: false,
  },
  alias: {
    e: "extract",
    f: "formatter",
    h: "help",
    i: "ignore-path",
    q: "quiet",
    s: "syntax",
    v: "verbose",
  },
}
const syntaxOptions = [ "scss", "less", "sugarss" ]

const meowOptions = {
  help: [
    "Usage",
    "  stylelint [input] [options]",
    "",
    "Input",
    "  Files(s) or glob(s).",
    "  If an input argument is wrapped in quotation marks, it will be passed to node-glob",
    "  for cross-platform glob support.",
    "  `node_modules` and `bower_components` are always ignored.",
    "  You can also pass no input and use stdin, instead.",
    "",
    "Options",
    "  --config            Path to a specific configuration file (JSON, YAML, or CommonJS),",
    "                      or the name of a module in `node_modules` that points to one.",
    "                      If no `--config` argument is provided, stylelint will search for",
    "                      configuration  files in the following places, in this order:",
    "                        - a `stylelint` property in `package.json`",
    "                        - a `.stylelintrc` file (with or without filename extension:",
    "                          `.json`, `.yaml`, and `.js` are available)",
    "                        - a `stylelint.config.js` file exporting a JS object",
    "                      The search will begin in the working directory and move up the",
    "                      directory tree until a configuration file is found.",
    "  --version           Get the currently installed version of stylelint.",
    "  --custom-formatter  Path to a JS file exporting a custom formatting function",
    "  --stdin-filename    Specify a filename to assign stdin input",
    "  -f, --formatter     Specify a formatter: \"json\", \"string\" or \"verbose\". Default is \"string\".",
    "  -i, --ignore-path   Specify a to a file containing patterns describing files",
    "                      to ignore. The path can be absolute or relative to `cwd`.",
    "                      By default, stylelint looks for `.stylelintignore` in the",
    "                      same directory as the configuration file.",
    "  -q, --quiet         Only register warnings for rules with an \"error\"-level severity",
    "                      (ignore \"warning\"-level)",
    "  -s, --syntax        Specify a non-standard syntax that should be used to ",
    "                      parse source stylesheets. Options: \"scss\", \"less\", \"sugarss\"",
    "  -e, --extract       Extract and lint CSS from style tags in HTML structures",
  ],
  pkg: "../package.json",
}

const cli = meow(meowOptions, minimistOptions)

let formatter = cli.flags.formatter
if (cli.flags.customFormatter) {
  formatter = require(path.join(process.cwd(), cli.flags.customFormatter))
} else if (cli.flags.verbose) {
  formatter = "verbose"
  console.log( // eslint-disable-line no-console
    "The '-v' and '--verbose' flags have been deprecated, and will be removed in '7.0'. " +
    "Use '-f verbose' or '--formatter verbose' instead."
  )
}

const optionsBase = {
  formatter,
  configOverrides: {},
}

if (cli.flags.quiet) {
  optionsBase.configOverrides.quiet =  cli.flags.quiet
}

if (cli.flags.syntax && includes(syntaxOptions, cli.flags.syntax)) {
  optionsBase.syntax = cli.flags.syntax
}

if (cli.flags.extract) {
  optionsBase.extractStyleTagsFromHtml = cli.flags.extract
}

if (cli.flags.config) {
  // Should check these possibilities:
  //   a. name of a node_module
  //   b. absolute path
  //   c. relative path relative to `process.cwd()`.
  // If none of the above work, we'll try a relative path starting
  // in `process.cwd()`.
  optionsBase.configFile = resolveFrom(process.cwd(), cli.flags.config)
    || path.join(process.cwd(), cli.flags.config)
}

if (cli.flags.stdinFilename) {
  optionsBase.codeFilename = cli.flags.stdinFilename
}

if (cli.flags.ignorePath) {
  optionsBase.ignorePath = cli.flags.ignorePath
}

Promise.resolve().then(() => {
  // Add input/code into options
  if (cli.input.length) {
    return assign({}, optionsBase, {
      files: cli.input,
    })
  }
  return getStdin().then(stdin => assign({}, optionsBase, {
    code: stdin,
  }))
}).then(options => {
  if (!options.files && !options.code) {
    cli.showHelp()
  }

  return standalone(options)
}).then(({ output, errored }) => {
  if (!output) { return }
  process.stdout.write(output)
  if (errored) { process.exitCode = 2 }
}).catch(err => {
  console.log(err.stack) // eslint-disable-line no-console
  process.exit(err.code || 1)
})
