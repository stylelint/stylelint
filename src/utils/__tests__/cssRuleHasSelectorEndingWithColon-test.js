import cssRuleHasSelectorEndingWithColon from "../cssRuleHasSelectorEndingWithColon"
import postcss from "postcss"
import test from "tape"

test("cssRuleHasSelectorEndingWithColon", t => {
  t.ok(postcssCheck("--custom-property-set: {}"))
  t.notOk(postcssCheck("a {}"))
  t.notOk(postcssCheck("a:last-child {}"))
  t.notOk(postcssCheck("a::after {}"))
  t.notOk(postcssCheck(":--custom-selector {}"))
  t.notOk(postcssCheck(":--custom-selector:--custom-selector {}"))
  t.end()
})

function postcssCheck(cssString) {
  const root = postcss.parse(cssString)
  return cssRuleHasSelectorEndingWithColon(root.first)
}
