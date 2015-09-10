#!/usr/bin/env node

import meow from "meow"
import path from "path"
import { assign } from "lodash"
import getStdin from "get-stdin"
import standalone from "./standalone"

const minimistOptions = {
  default: {
    f: "string",
  },
  alias: {
    f: "formatter",
  },
}
import standalone from "./standalone"

const minimistOptions = {}

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
    "  -f, --formatter     Specify a formatter: \"json\" or \"string\". Default is \"string\".",
    "  --custom-formatter  Path to a JS file exporting a custom formatting function",
  ],
  pkg: "../package.json",
}

const cli = meow(meowOptions, minimistOptions)

const formatter = (cli.flags.customFormatter)
  ? require(path.join(process.cwd(), cli.flags.customFormatter))
  : cli.flags.formatter

const configBase = {
  formatter,
}

let configReady = (cli.input.length)
  ? Promise.resolve(assign({}, configBase, {
    files: cli.input,
  }))
  : getStdin().then(stdin => Promise.resolve(assign({}, configBase, {
    css: stdin,
  })))

configReady.then(config => {
  standalone(config)
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
