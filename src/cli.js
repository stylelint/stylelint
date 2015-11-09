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
    "By default, stylelint will look for a .stylelintrc file in JSON format,",
    "using rc to look in various places (cf. https://github.com/dominictarr/rc#standards).",
    "Alternately, you can specify a configuration file via --config.",
    "",
    "Input",
    "  File glob(s) (passed to node-glob).",
    "  You can also pass no input and use stdin.",
    "",
    "Options",
    "  --config            Path to a JSON configuration file.",
    "  --version           Get the currently installed version of stylelint.",
    "  --custom-formatter  Path to a JS file exporting a custom formatting function",
    "  -f, --formatter     Specify a formatter: \"json\" or \"string\". Default is \"string\".",
    "  -q, --quiet         Only register warnings for rules with a severity of 2 (ignore level 1)",
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

if (cli.flags.s && includes(syntaxOptions, cli.flags.s)) {
  optionsBase.syntax = cli.flags.s
}

let optionsReady = (cli.input.length)
  ? Promise.resolve(assign({}, optionsBase, {
    files: cli.input,
  }))
  : getStdin().then(stdin => Promise.resolve(assign({}, optionsBase, {
    code: stdin,
  })))

optionsReady.then(options => {
  standalone(options)
    .then(({ output, errored }) => {
      if (!output) { return }
      process.stdout.write(output)
      if (errored) { process.exit(2) }
    })
    .catch(err => {
      console.log(err.stack)
      process.exit(err.code || 1)
    })
})
