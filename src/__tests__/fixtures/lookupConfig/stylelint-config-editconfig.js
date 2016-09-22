const editorconfig = require("editorconfig")
module.exports = function (merged, config) {
  if (config.sourcePath) {
    return editorconfig.parse(config.sourcePath).then(editorconfig => {
      return {
        rules: {
          "indentation": editorconfig.indent_size,
          "no-eol-whitespace": editorconfig.trim_trailing_whitespace,
          "no-missing-end-of-source-newline": editorconfig.insert_final_newline,
        },
      }
    })
  } else {
    return {}
  }
}
