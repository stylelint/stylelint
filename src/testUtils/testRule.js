import postcss from "postcss"

export default rule => {
  return (cssString, options, callback) => {
    if (typeof options === "function") {
      callback = options
      options = null
    }

    postcss()
      .use(rule(options))
      .process(cssString)
      .then(result => {
        callback(result.warnings())
      })
  }
}
