var autoprefixer = require("autoprefixer-core")

const properties = new Set()
const selectors = new Set()
const atRules = new Set()

Object.keys(autoprefixer.data.prefixes).forEach(function (item) {
  if (item[0] === ":") {
    selectors.add(item)
    return
  }
  if (item[0] === "@") {
    atRules.add(item.slice(1))
    return
  }
  properties.add(item)
})

export default {
  properties,
  selectors,
  atRules,
}
