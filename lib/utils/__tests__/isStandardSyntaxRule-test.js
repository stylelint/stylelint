"use strict"

const isStandardSyntaxRule = require("../isStandardSyntaxRule")
const less = require("postcss-less")
const postcss = require("postcss")
const test = require("tape")

test("isStandardSyntaxRule", t => {
  t.plan(20)

  rules("a {}", rule => {
    t.ok(isStandardSyntaxRule(rule), "type")
  })
  rules("a:last-child {}", rule => {
    t.ok(isStandardSyntaxRule(rule), "pseudo-class")
  })
  rules("a:not(.a) {}", rule => {
    t.ok(isStandardSyntaxRule(rule), "pseudo-class not")
  })
  rules("a::after {}", rule => {
    t.ok(isStandardSyntaxRule(rule), "pseudo-element")
  })
  rules(":--custom-selector {}", rule => {
    t.ok(isStandardSyntaxRule(rule), "custom-selector")
  })
  rules(":--custom-selector:--custom-selector {}", rule => {
    t.ok(isStandardSyntaxRule(rule), "compound custom-selectors")
  })

  rules("--custom-property-set: {}", rule => {
    t.notOk(isStandardSyntaxRule(rule), "custom-property-set")
  })

  lessRules(".mixin-name(@var);", rule => {
    t.notOk(isStandardSyntaxRule(rule), "called Less class parametric mixin")
  })
  lessRules(".mixin-name() {}", rule => {
    t.notOk(isStandardSyntaxRule(rule), "non-ouputting Less class mixin definition")
  })
  lessRules(".mixin-name(@a, @b) {}", rule => {
    t.notOk(isStandardSyntaxRule(rule), "non-ouputting parametric Less class mixin definition")
  })
  lessRules(".mixin-name3(@a, @b) {}", rule => {
    t.notOk(isStandardSyntaxRule(rule), "non-ouputting parametric Less class mixin definition ending in number")
  })
  lessRules("#mixin-name() {}", rule => {
    t.notOk(isStandardSyntaxRule(rule), "non-ouputting Less id mixin definition")
  })
  lessRules("#mixin-name;", rule => {
    t.notOk(isStandardSyntaxRule(rule), "called Less id mixin")
  })
  lessRules("#mixin-name;", rule => {
    t.notOk(isStandardSyntaxRule(rule), "called Less id mixin")
  })
  lessRules("#namespace > .mixin-name;", rule => {
    t.notOk(isStandardSyntaxRule(rule), "called namespaced Less mixin (child)")
  })
  lessRules("#namespace .mixin-name;", rule => {
    t.notOk(isStandardSyntaxRule(rule), "called namespaced Less mixin (descendant)")
  })
  lessRules("#namespace.mixin-name;", rule => {
    t.notOk(isStandardSyntaxRule(rule), "called namespaced Less mixin (compound)")
  })
  lessRules(".box-shadow(@style, @c) when (iscolor(@c)) {}", rule => {
    t.notOk(isStandardSyntaxRule(rule), "less mixin")
  })
  lessRules("&:extend(.inline);", rule => {
    t.notOk(isStandardSyntaxRule(rule), "less extend")
  })
  lessRules("@foo: {};", rule => {
    t.notOk(isStandardSyntaxRule(rule), "less detached rulesets")
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
