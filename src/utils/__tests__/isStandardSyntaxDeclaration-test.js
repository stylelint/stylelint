import isStandardSyntaxDeclaration from "../isStandardSyntaxDeclaration"
import postcss from "postcss"
import test from "tape"

test("isStandardSyntaxDeclaration", t => {

  t.plan(7)

  rules("a { a: b }", decl => {
    t.ok(isStandardSyntaxDeclaration(decl), "standard prop and value")
  })
  rules("a { a: $b }", decl => {
    t.ok(isStandardSyntaxDeclaration(decl), "standard prop and scss var")
  })
  rules("a { --custom-property: x }", decl => {
    t.ok(isStandardSyntaxDeclaration(decl), "custom-property")
  })
  rules("a { a : calc(b + c) }", decl => {
    t.ok(isStandardSyntaxDeclaration(decl), "standard prop and calc value")
  })

  rules("$var: b", decl => {
    t.notOk(isStandardSyntaxDeclaration(decl), "scss var")
  })
  rules("$list: (key: value, key2: value2)", decl => {
    t.notOk(isStandardSyntaxDeclaration(decl), "scss list")
  })
  rules("$map: (value, value2)", decl => {
    t.notOk(isStandardSyntaxDeclaration(decl), "scss map")
  })
})

function rules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkDecls(cb)
  })
}
