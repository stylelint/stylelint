#!/usr/bin/env node

import meow from "meow"
import path from "path"
import { assign, includes } from "lodash"
import getStdin from "get-stdin"
import standalone from "./standalone"

const minimistOptions = {
  default: {
    f: "string",
    q: false,
    config: false,
  },
  alias: {
    f: "formatter",
    q: "quiet",
    s: "syntax",
  },
}
const syntaxOptions = ["scss"]

const meowOptions = {
  help: [
    "Usage",
    "  stylelint [input] [options]",
    "",
    "By default, finding and loading of your configuration object is done with",
    "cosmiconfig (https://github.com/davidtheclark/cosmiconfig)",
    "Starting from the current working directory, it will look for the ",
    "following possible sources, in this order:",
    "- a stylelint property in package.json",
    "- a .stylelintrc file in JSON or YAML format",
    "- a stylelint.config.js file exporting a JS object",
    "Alternately, you can specify the path to a configuration file with --config.",
    "",
    "Input",
    "  File glob(s) (passed to node-glob).",
    "  You can also pass no input and use stdin, instead.",
    "",
    "Options",
    "  --config            Path to a JSON configuration file.",
    "  --version           Get the currently installed version of stylelint.",
    "  --custom-formatter  Path to a JS file exporting a custom formatting function",
    "  -f, --formatter     Specify a formatter: \"json\" or \"string\". Default is \"string\".",
    "  -q, --quiet         Only register warnings for rules with an \"error\"-level severity",
    "                      (ignore \"warning\"-level)",
    "  -s, --syntax        Specify a non-standard syntax that should be used to ",
    "                      parse source stylesheets. Options: \"scss\"",
  ],
  pkg: "../package.json",
}

const cli = meow(meowOptions, minimistOptions)

const formatter = (cli.flags.customFormatter)
  ? require(path.join(process.cwd(), cli.flags.customFormatter))
  : cli.flags.formatter

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

if (cli.flags.config) {
  optionsBase.configFile = path.join(process.cwd(), cli.flags.config)
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
  return standalone(options)
}).then(({ output, errored }) => {
  if (!output) { return }
  process.stdout.write(output)
  if (errored) { process.exit(2) }
}).catch(err => {
  console.log(err.stack)
  process.exit(err.code || 1)
})
