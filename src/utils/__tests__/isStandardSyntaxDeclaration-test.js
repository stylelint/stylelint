import isStandardSyntaxDeclaration from "../isStandardSyntaxDeclaration"
import less from "postcss-less"
import postcss from "postcss"
import scss from "postcss-scss"
import test from "tape"

test("isStandardSyntaxDeclaration", t => {

  t.plan(18)

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
  scssRules("a { #{$var}: 10px; }", decl => {
    t.ok(isStandardSyntaxDeclaration(decl), "property with scss variable interpolation (only)")
  })
  scssRules("a { prop#{$var}: 10px; }", decl => {
    t.ok(isStandardSyntaxDeclaration(decl), "property with scss variable interpolation (end)")
  })
  scssRules("a { prop#{$var}erty: 10px; }", decl => {
    t.ok(isStandardSyntaxDeclaration(decl), "property with scss variable interpolation (middle)")
  })
  lessRules("a { @{var}: 10px; }", decl => {
    t.ok(isStandardSyntaxDeclaration(decl), "property with less variable interpolation (only)")
  })
  lessRules("a { prop@{var}: 10px; }", decl => {
    t.ok(isStandardSyntaxDeclaration(decl), "property with less variable interpolation (end)")
  })
  lessRules("a { prop@{var}erty: 10px; }", decl => {
    t.ok(isStandardSyntaxDeclaration(decl), "property with less variable interpolation (middle)")
  })

  scssRules("$var: b", decl => {
    t.notOk(isStandardSyntaxDeclaration(decl), "scss var")
  })
  scssRules("$list: (key: value, key2: value2)", decl => {
    t.notOk(isStandardSyntaxDeclaration(decl), "scss list")
  })
  scssRules("$map: (value, value2)", decl => {
    t.notOk(isStandardSyntaxDeclaration(decl), "scss map")
  })
  scssRules("a { $var: b }", decl => {
    t.notOk(isStandardSyntaxDeclaration(decl), "nested scss var")
  })
  scssRules("a { $list: (key: value, key2: value2) }", decl => {
    t.notOk(isStandardSyntaxDeclaration(decl), "nested scss list")
  })
  scssRules("a { $map: (value, value2) }", decl => {
    t.notOk(isStandardSyntaxDeclaration(decl), "nested scss map")
  })
  lessRules("@var: b", decl => {
    t.notOk(isStandardSyntaxDeclaration(decl), "less var")
  })
  lessRules("a { @var: b }", decl => {
    t.notOk(isStandardSyntaxDeclaration(decl), "nested less var")
  })
})

function rules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkDecls(cb)
  })
}

function scssRules(css, cb) {
  postcss().process(css, { syntax: scss }).then(result => {
    result.root.walkDecls(cb)
  })
}

function lessRules(css, cb) {
  postcss().process(css, { syntax: less }).then(result => {
    result.root.walkDecls(cb)
  })
}
