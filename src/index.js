import postcssPlugin from "./postcssPlugin"
import standalone from "./standalone"
import createPlugin from "./createPlugin"
import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
  cssWordIsVariable,
} from "./utils"

const stylelint = postcssPlugin

stylelint.utils = {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
  cssWordIsVariable,
}

stylelint.lint = standalone
stylelint.createPlugin = createPlugin

module.exports = stylelint
