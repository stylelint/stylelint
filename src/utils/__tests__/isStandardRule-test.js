import isStandardRule from "../isStandardRule"
import less from "postcss-less"
import scss from "postcss-scss"
import postcss from "postcss"
import test from "tape"

test("isStandardRule", t => {
  t.plan(16)

  rules("a {}", rule => {
    t.ok(isStandardRule(rule), "type")
  })
  rules("a:last-child {}", rule => {
    t.ok(isStandardRule(rule), "pseudo-class")
  })
  rules("a:not(.a) {}", rule => {
    t.ok(isStandardRule(rule), "pseudo-class not")
  })
  rules("a::after {}", rule => {
    t.ok(isStandardRule(rule), "pseudo-element")
  })
  rules(":--custom-selector {}", rule => {
    t.ok(isStandardRule(rule), "custom-selector")
  })
  rules(":--custom-selector:--custom-selector {}", rule => {
    t.ok(isStandardRule(rule), "compound custom-selectors")
  })

  rules("--custom-property-set: {}", rule => {
    t.notOk(isStandardRule(rule), "custom-property-set")
  })

  scssRules(".n-#{$n}", rule => {
    t.notOk(isStandardRule(rule), "scss interpolation")
  })

  lessRules(".mixin-name(@var);", rule => {
    t.notOk(isStandardRule(rule), "called Less class parametric mixin")
  })
  lessRules(".mixin-name() {}", rule => {
    t.notOk(isStandardRule(rule), "non-ouputting Less class mixin definition")
  })
  lessRules("#mixin-name() {}", rule => {
    t.notOk(isStandardRule(rule), "non-ouputting Less id mixin definition")
  })
  lessRules("#mixin-name;", rule => {
    t.notOk(isStandardRule(rule), "called Less id mixin")
  })
  lessRules("#mixin-name;", rule => {
    t.notOk(isStandardRule(rule), "called Less id mixin")
  })
  lessRules("#namespace > .mixin-name;", rule => {
    t.notOk(isStandardRule(rule), "called namespaced Less mixin (child)")
  })
  lessRules("#namespace .mixin-name;", rule => {
    t.notOk(isStandardRule(rule), "called namespaced Less mixin (descendant)")
  })
  lessRules("#namespace.mixin-name;", rule => {
    t.notOk(isStandardRule(rule), "called namespaced Less mixin (compound)")
  })
  lessRules(".n-@{n}", rule => {
    t.notOk(isStandardRule(rule), "Less interpolation")
  })
})

function rules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkRules(cb)
  })
}

function lessRules(css, cb) {
  postcss().process(css, { syntax: less }).then(result => {
    result.root.walkRules(cb)
  })
}

function scssRules(css, cb) {
  postcss().process(css, { syntax: scss }).then(result => {
    result.root.walkRules(cb)
  })
}
