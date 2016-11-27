/* @flow */
import _ from "lodash"
import createStylelint from "./createStylelint"
import postcss from "postcss"

export default postcss.plugin("stylelint", function () {
  const options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

  const tailoredOptions/*: Object*/ = options.rules ? { config: options } : options

  const stylelint = createStylelint(tailoredOptions)
  return (root, result) => {
    return stylelint._lintSource({
      filePath: options.from || _.get(root, "source.input.file"),
      existingPostcssResult: result,
    })
  }
})
