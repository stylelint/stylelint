import postcss from "postcss"
import rules from "./rules"

export default postcss.plugin("stylelint", options => {
  return (css, result) => {
    Object.keys(options.rules).forEach(rule => {
      if (!rules[rule]) {
        throw new Error(
          `Undefined rule ${rule}`
        )
      }

      rules[rule](options[rule])(css, result)
    })
  }
})
