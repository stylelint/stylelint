import isKeyframeRule from "../isKeyframeRule"
import postcss from "postcss"

it("isKeyframeRule", () => {
  rules("@keyframes identifier { to {} }", rule => {
    expect(isKeyframeRule(rule)).toBeTruthy()
  })
  rules("@kEyFrAmEs identifier { to {} }", rule => {
    expect(isKeyframeRule(rule)).toBeTruthy()
  })
  rules("@KEYFRAMES identifier { to {} }", rule => {
    expect(isKeyframeRule(rule)).toBeTruthy()
  })
  rules("@keyframes identifier { from {} }", rule => {
    expect(isKeyframeRule(rule)).toBeTruthy()
  })
  rules("@keyframes identifier { 50% {} }", rule => {
    expect(isKeyframeRule(rule)).toBeTruthy()
  })

  rules("a {}", rule => {
    expect(isKeyframeRule(rule)).toBeFalsy()
  })
  rules("a { & b {} }", rule => {
    expect(isKeyframeRule(rule)).toBeFalsy()
  })
  rules("a { @nest b & {} }", rule => {
    expect(isKeyframeRule(rule)).toBeFalsy()
  })
  rules("@media print { a {} }", rule => {
    expect(isKeyframeRule(rule)).toBeFalsy()
  })
  rules("@supports (animation-name: test) { a {} }", rule => {
    expect(isKeyframeRule(rule)).toBeFalsy()
  })
})

function rules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkRules(cb)
  })
}
