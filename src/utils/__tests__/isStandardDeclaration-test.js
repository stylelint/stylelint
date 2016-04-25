import isStandardDeclaration from "../isStandardDeclaration"
import less from "postcss-less"
import postcss from "postcss"
import test from "tape"

test("isStandardDeclaration", t => {

  t.plan(8)

  rules("a { a: b }", decl => {
    t.ok(isStandardDeclaration(decl), "standard prop and value")
  })
  rules("a { a: $b }", decl => {
    t.ok(isStandardDeclaration(decl), "standard prop and scss var")
  })
  rules("a { --custom-property: x }", decl => {
    t.ok(isStandardDeclaration(decl), "custom-property")
  })
  rules("a { a : calc(b + c) }", decl => {
    t.ok(isStandardDeclaration(decl), "standard prop and calc value")
  })

  rules("$var: b", decl => {
    t.notOk(isStandardDeclaration(decl), "scss var")
  })
  rules("$list: (key: value, key2: value2)", decl => {
    t.notOk(isStandardDeclaration(decl), "scss list")
  })
  rules("$map: (value, value2)", decl => {
    t.notOk(isStandardDeclaration(decl), "scss map")
  })

  lessRules("a { @var: b }", decl => {
    t.notOk(isStandardDeclaration(decl), "less var")
  })
})

function rules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkDecls(cb)
  })
}

function lessRules(css, cb) {
  postcss().process(css, { syntax: less }).then(result => {
    result.root.walkDecls(cb)
  })
}
