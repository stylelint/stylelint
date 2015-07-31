module.exports = require("./plugin")

module.exports.utils = {
  report: require("./utils/report"),
  ruleMessages: require("./utils/ruleMessages"),
  styleSearch: require("./utils/styleSearch"),
  validateOptions: require("./utils/validateOptions"),
}
