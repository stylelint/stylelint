import isStandardDeclaration from "../isStandardDeclaration"
import postcss from "postcss"
import test from "tape"

test("isStandardDeclaration", t => {
  t.ok(postcssCheck("a: b"))
  t.ok(postcssCheck("a: $b"))
  t.ok(postcssCheck("--prefix-a-b: $c"))
  t.ok(postcssCheck("a : calc(b + c)"))

  t.notOk(postcssCheck("$var: b"), "dollar var")
  t.notOk(postcssCheck("$list: (key: value, key2: value2)", "dollar list"))
  t.notOk(postcssCheck("$map: (value, value2)", "dollar map"))
  t.end()
})

function postcssCheck(cssString) {
  const root = postcss.parse(cssString)
  return isStandardDeclaration(root.first)
}
