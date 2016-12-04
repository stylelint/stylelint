"use strict"

const report = require("./utils/report")
const ruleMessages = require("./utils/ruleMessages")
const validateOptions = require("./utils/validateOptions")
const checkAgainstRule = require("./utils/checkAgainstRule")
const createPlugin = require("./createPlugin")
const createRuleTester = require("./testUtils/createRuleTester")
const createStylelint = require("./createStylelint")
const postcssPlugin = require("./postcssPlugin")
const rules = require("./rules")
const formatters = require("./formatters")
const standalone = require("./standalone")

const api = postcssPlugin

api.utils = {
  report,
  ruleMessages,
  validateOptions,
  checkAgainstRule,
}

api.lint = standalone
api.rules = rules
api.formatters = formatters
api.createPlugin = createPlugin
api.createRuleTester = createRuleTester
api.createLinter = createStylelint

module.exports = api
