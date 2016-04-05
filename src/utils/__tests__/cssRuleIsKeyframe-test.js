import cssRuleIsKeyframe from "../cssRuleIsKeyframe"
import postcss from "postcss"
import test from "tape"

test("cssRuleIsKeyframe", t => {

  t.plan(9)

  rules("@keyframes identifier { to {} }", rule => {
    t.ok(cssRuleIsKeyframe(rule), "to")
  })
  rules("@keyframes identifier { from {} }", rule => {
    t.ok(cssRuleIsKeyframe(rule), "from")
  })
  rules("@keyframes identifier { 50% {} }", rule => {
    t.ok(cssRuleIsKeyframe(rule), "50%")
  })

  rules("a {}", rule => {
    t.notOk(cssRuleIsKeyframe(rule), "rule")
  })
  rules("a { & b {} }", rule => {
    t.notOk(cssRuleIsKeyframe(rule), "rule and direct nested rule")
  })
  rules("a { @nest b & {} }", rule => {
    t.notOk(cssRuleIsKeyframe(rule), "@nest nested rule")
  })
  rules("@media print { a {} }", rule => {
    t.notOk(cssRuleIsKeyframe(rule), "@media")
  })
  rules("@supports (animation-name: test) { a {} }", rule => {
    t.notOk(cssRuleIsKeyframe(rule), "@supports")
  })
})

function rules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkRules(cb)
  })
}
