import isStandardAtRule from "../isStandardAtRule"
import scss from "postcss-scss"
import less from "postcss-less"
import postcss from "postcss"
import test from "tape"

test("isStandardAtRule", t => {

  t.plan(12)

  atRules("@charset UTF-8;", atRule => {
    t.ok(isStandardAtRule(atRule), "non nested at-rules without quotes")
  })

  atRules("@charset 'UTF-8';", atRule => {
    t.ok(isStandardAtRule(atRule), "non nested at-rules with `'` quotes")
  })

  atRules("@charset \"UTF-8\";", atRule => {
    t.ok(isStandardAtRule(atRule), "non nested at-rules with `\"` quotes")
  })

  atRules("@charset\'UTF-8\';", atRule => {
    t.ok(isStandardAtRule(atRule), "non nested at-rules with `'` quotes and without space after name")
  })

  atRules("@charset\"UTF-8\";", atRule => {
    t.ok(isStandardAtRule(atRule), "non nested at-rules with `\"` quotes and without space after name")
  })

  atRules("@import url(\"fineprint.css\") print;", atRule => {
    t.ok(isStandardAtRule(atRule), "non nested at-rules with function and without space after name")
  })

  atRules("@media (min-width: 100px) {};", atRule => {
    t.ok(isStandardAtRule(atRule), "nested at-rules")
  })

  atRules("@media\n(min-width: 100px) {};", atRule => {
    t.ok(isStandardAtRule(atRule), "nested at-rules with newline after name")
  })

  atRules("@media\r\n(min-width: 100px) {};", atRule => {
    t.ok(isStandardAtRule(atRule), "nested at-rules with newline after name")
  })

  atRules("@media(min-width: 100px) {};", atRule => {
    t.ok(isStandardAtRule(atRule), "nested at-rules without space after name")
  })

  scssAtRules("@mixin mixin() { @content; };", atRule => {
    if (atRule.name === "mixin") { return }
    t.notOk(isStandardAtRule(atRule), "ignore `@content` inside mixins")
  })

  lessAtRules("@detached-ruleset: { background: red; }; .top { @detached-ruleset(); }", atRule => {
    t.notOk(isStandardAtRule(atRule), "ignore passing rulesets to mixins")
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
