import cssDeclarationIsMap from "../cssDeclarationIsMap"
import postcss from "postcss"
import test from "tape"

test("cssDeclarationIsMap", t => {
  t.notOk(postcssCheck("a: b"))
  t.notOk(postcssCheck(".a: $b"))
  t.notOk(postcssCheck("$a: (b)"))
  t.notOk(postcssCheck("$a: calc(b + c)"))
  t.ok(postcssCheck("$map: (key:value)"))
  t.ok(postcssCheck("$var: (\nkey: value)"))
  t.ok(postcssCheck("$var :\n(key: value, key2: value2)"))
  t.end()
})

function postcssCheck(cssString) {
  const root = postcss.parse(cssString)
  return cssDeclarationIsMap(root.first)
}
