import isStandardSyntaxAtRule from "../isStandardSyntaxAtRule"
import less from "postcss-less"
import postcss from "postcss"
import scss from "postcss-scss"

it("isStandardSyntaxAtRule", () => {
  t.plan(12)

  atRules("@charset UTF-8;", atRule => {
    expect(isStandardSyntaxAtRule(atRule)).toBeTruthy()
  })

  atRules("@charset 'UTF-8';", atRule => {
    expect(isStandardSyntaxAtRule(atRule)).toBeTruthy()
  })

  atRules("@charset \"UTF-8\";", atRule => {
    expect(isStandardSyntaxAtRule(atRule)).toBeTruthy()
  })

  atRules("@charset\'UTF-8\';", atRule => {
    expect(isStandardSyntaxAtRule(atRule)).toBeTruthy()
  })

  atRules("@charset\"UTF-8\";", atRule => {
    expect(isStandardSyntaxAtRule(atRule)).toBeTruthy()
  })

  atRules("@import url(\"fineprint.css\") print;", atRule => {
    expect(isStandardSyntaxAtRule(atRule)).toBeTruthy()
  })

  atRules("@media (min-width: 100px) {};", atRule => {
    expect(isStandardSyntaxAtRule(atRule)).toBeTruthy()
  })

  atRules("@media\n(min-width: 100px) {};", atRule => {
    expect(isStandardSyntaxAtRule(atRule)).toBeTruthy()
  })

  atRules("@media\r\n(min-width: 100px) {};", atRule => {
    expect(isStandardSyntaxAtRule(atRule)).toBeTruthy()
  })

  atRules("@media(min-width: 100px) {};", atRule => {
    expect(isStandardSyntaxAtRule(atRule)).toBeTruthy()
  })

  scssAtRules("@mixin mixin() { @content; };", atRule => {
    if (atRule.name === "mixin") { return }
    expect(isStandardSyntaxAtRule(atRule)).toBeFalsy()
  })

  lessAtRules("@detached-ruleset: { background: red; }; .top { @detached-ruleset(); }", atRule => {
    expect(isStandardSyntaxAtRule(atRule)).toBeFalsy()
  })
})

function atRules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkAtRules(cb)
  })
}

function scssAtRules(css, cb) {
  postcss().process(css, { syntax: scss }).then(result => {
    result.root.walkAtRules(cb)
  })
}

function lessAtRules(css, cb) {
  postcss().process(css, { syntax: less }).then(result => {
    result.root.walkAtRules(cb)
  })
}
