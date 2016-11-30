"use strict"

const isKeyframeRule = require("../isKeyframeRule")
const postcss = require("postcss")
const test = require("tape")

test("isKeyframeRule", t => {
  t.plan(11)

  rules("@keyframes identifier { to {} }", rule => {
    t.ok(isKeyframeRule(rule), "to")
  })
  rules("@kEyFrAmEs identifier { to {} }", rule => {
    t.ok(isKeyframeRule(rule), "to")
  })
  rules("@KEYFRAMES identifier { to {} }", rule => {
    t.ok(isKeyframeRule(rule), "to")
  })
  rules("@keyframes identifier { from {} }", rule => {
    t.ok(isKeyframeRule(rule), "from")
  })
  rules("@keyframes identifier { 50% {} }", rule => {
    t.ok(isKeyframeRule(rule), "50%")
  })

  rules("a {}", rule => {
    t.notOk(isKeyframeRule(rule), "rule")
  })
  rules("a { & b {} }", rule => {
    t.notOk(isKeyframeRule(rule), "rule and direct nested rule")
  })
  rules("a { @nest b & {} }", rule => {
    t.notOk(isKeyframeRule(rule), "@nest nested rule")
  })
  rules("@media print { a {} }", rule => {
    t.notOk(isKeyframeRule(rule), "@media")
  })
  rules("@supports (animation-name: test) { a {} }", rule => {
    t.notOk(isKeyframeRule(rule), "@supports")
  })
})

function rules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkRules(cb)
  })
}
