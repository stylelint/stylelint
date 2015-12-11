import postcssPlugin from "./postcssPlugin"
import standalone from "./standalone"
import createPlugin from "./createPlugin"
import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "./utils"

const stylelint = postcssPlugin

stylelint.utils = {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
}

stylelint.lint = standalone
stylelint.createPlugin = createPlugin

module.exports = stylelint
