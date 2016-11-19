import isStandardSyntaxDeclaration from "../isStandardSyntaxDeclaration"
import less from "postcss-less"
import postcss from "postcss"
import scss from "postcss-scss"

it("isStandardSyntaxDeclaration", () => {
  rules("a { a: b }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
  })
  rules("a { a: $b }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
  })
  rules("a { --custom-property: x }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
  })
  rules("a { a : calc(b + c) }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
  })
  rules("@page { size: A4 }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
  })
  scssRules("a { #{$var}: 10px; }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
  })
  scssRules("a { prop#{$var}: 10px; }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
  })
  scssRules("a { prop#{$var}erty: 10px; }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
  })
  scssRules("a { --custom-property-set: { color: blue; } }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
  })
  lessRules("a { @{var}: 10px; }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
  })
  lessRules("a { prop@{var}: 10px; }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
  })
  lessRules("a { prop@{var}erty: 10px; }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeTruthy()
  })

  scssRules("$var: b", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
  })
  scssRules("$list: (key: value, key2: value2)", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
  })
  scssRules("$map: (value, value2)", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
  })
  scssRules("a { $var: b }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
  })
  scssRules("a { $list: (key: value, key2: value2) }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
  })
  scssRules("a { border: { style: solid; color: red; } }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
  })
  scssRules("a { $map: (value, value2) }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
  })
  lessRules("@var: b", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
  })
  lessRules("a { @var: b }", decl => {
    expect(isStandardSyntaxDeclaration(decl)).toBeFalsy()
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
