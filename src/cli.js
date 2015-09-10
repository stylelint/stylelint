#!/usr/bin/env node

import meow from "meow"
import standalone from "./standalone"

const minimistOptions = {}

const meowOptions = {
  help: [
    "Usage",
    "  stylelint [input] [options]",
    "",
    "By default, stylelint will look for a .stylelintrc file in JSON, YML, or CommonJS format,",
    "using rc to look in various places (cf. https://github.com/dominictarr/rc#standards).",
    "Alternatley, you can specify a configuration file with options.",
    "",
    "Input",
    "  A file glob (passed to node-glob).",
    "  You can also pass no input and use stdin.",
    "",
    "Options",
    "  --config  Path to a configuration file in JSON, YML, or CommonJS format.",
  ],
  pkg: "../package.json",
}

const cli = meow(meowOptions, minimistOptions)

const standaloneConfig = {}
if (cli.input.length) {
  standaloneConfig.files = cli.input
}

standalone(standaloneConfig)
  .then(({ output, errored }) => {
    process.stdout.write(output)
    if (errored) { process.exit(2) }
  })
  .catch(err => {
    console.error(err.stack)
  })
