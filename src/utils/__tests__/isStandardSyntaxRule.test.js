import isStandardSyntaxRule from "../isStandardSyntaxRule"
import less from "postcss-less"
import postcss from "postcss"

it("isStandardSyntaxRule", () => {
  rules("a {}", rule => {
    expect(isStandardSyntaxRule(rule)).toBeTruthy()
  })
  rules("a:last-child {}", rule => {
    expect(isStandardSyntaxRule(rule)).toBeTruthy()
  })
  rules("a:not(.a) {}", rule => {
    expect(isStandardSyntaxRule(rule)).toBeTruthy()
  })
  rules("a::after {}", rule => {
    expect(isStandardSyntaxRule(rule)).toBeTruthy()
  })
  rules(":--custom-selector {}", rule => {
    expect(isStandardSyntaxRule(rule)).toBeTruthy()
  })
  rules(":--custom-selector:--custom-selector {}", rule => {
    expect(isStandardSyntaxRule(rule)).toBeTruthy()
  })

  rules("--custom-property-set: {}", rule => {
    expect(isStandardSyntaxRule(rule)).toBeFalsy()
  })

  lessRules(".mixin-name(@var);", rule => {
    expect(isStandardSyntaxRule(rule)).toBeFalsy()
  })
  lessRules(".mixin-name() {}", rule => {
    expect(isStandardSyntaxRule(rule)).toBeFalsy()
  })
  lessRules(".mixin-name(@a, @b) {}", rule => {
    expect(isStandardSyntaxRule(rule)).toBeFalsy()
  })
  lessRules(".mixin-name3(@a, @b) {}", rule => {
    expect(isStandardSyntaxRule(rule)).toBeFalsy()
  })
  lessRules("#mixin-name() {}", rule => {
    expect(isStandardSyntaxRule(rule)).toBeFalsy()
  })
  lessRules("#mixin-name;", rule => {
    expect(isStandardSyntaxRule(rule)).toBeFalsy()
  })
  lessRules("#mixin-name;", rule => {
    expect(isStandardSyntaxRule(rule)).toBeFalsy()
  })
  lessRules("#namespace > .mixin-name;", rule => {
    expect(isStandardSyntaxRule(rule)).toBeFalsy()
  })
  lessRules("#namespace .mixin-name;", rule => {
    expect(isStandardSyntaxRule(rule)).toBeFalsy()
  })
  lessRules("#namespace.mixin-name;", rule => {
    expect(isStandardSyntaxRule(rule)).toBeFalsy()
  })
  lessRules(".box-shadow(@style, @c) when (iscolor(@c)) {}", rule => {
    expect(isStandardSyntaxRule(rule)).toBeFalsy()
  })
  lessRules("&:extend(.inline);", rule => {
    expect(isStandardSyntaxRule(rule)).toBeFalsy()
  })
  lessRules("@foo: {};", rule => {
    expect(isStandardSyntaxRule(rule)).toBeTruthy()
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
