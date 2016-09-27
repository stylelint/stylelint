const editorconfig = require("editorconfig")
module.exports = function (merged, config) {
  function mergeRule(ruleName, primary) {
    if (merged.rules[ruleName]) {
      if (merged.rules[ruleName] === "inherit") {
        merged.rules[ruleName] = primary
      } else if (Array.isArray(merged.rules[ruleName]) && merged.rules[ruleName][0] === "inherit") {
        merged.rules[ruleName][0] = primary
      }
    }
  }
  if (config.sourcePath) {
    return editorconfig.parse(config.sourcePath).then(editorconfig => {
      const rules = {
        "indentation": editorconfig.indent_size || null,
        "no-eol-whitespace": editorconfig.trim_trailing_whitespace || null,
        "no-missing-end-of-source-newline": editorconfig.insert_final_newline || null,
      }
      for (const ruleName in rules) {
        mergeRule(ruleName, rules[ruleName])
      }
      return {
        rules,
      }
    })
  } else {
    return {}
  }
}
