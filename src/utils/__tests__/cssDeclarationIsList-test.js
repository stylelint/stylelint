import cssDeclarationIsList from "../cssDeclarationIsList"
import postcss from "postcss"
import test from "tape"

test("cssDeclarationIsList", t => {
  t.notOk(postcssCheck("a: b"))
  t.notOk(postcssCheck(".a: $b"))
  t.notOk(postcssCheck("$a: calc(b + c)"))
  t.notOk(postcssCheck("$map: (key:value)"))
  t.notOk(postcssCheck("$map: (\nkey: value)"))
  t.notOk(postcssCheck("$map :\n(key: value, key2: value2)"))
  t.ok(postcssCheck("$list: (value)"))
  t.ok(postcssCheck("$list: ('value', 'value2')"))
  t.ok(postcssCheck("$list: (\n'value',\n'value2',\n)"))
  t.ok(postcssCheck("$list :\r\n(\r\n'value',\r'value2')"))
  t.end()
})

function postcssCheck(cssString) {
  const root = postcss.parse(cssString)
  return cssDeclarationIsList(root.first)
}
