"use strict"

const isStandardSyntaxProperty = require("../isStandardSyntaxProperty")
const test = require("tape")

test("isStandardSyntaxProperty", t => {
  t.ok(isStandardSyntaxProperty("top"), "single word")
  t.ok(isStandardSyntaxProperty("--custom-property"), "custom property")
  t.ok(isStandardSyntaxProperty("border-top-left-radius"), "hyphenated words")
  t.ok(isStandardSyntaxProperty("-webkit-appearance"), "vendor prefix")
  t.notOk(isStandardSyntaxProperty("$sass-variable"), "sass variable")
  t.notOk(isStandardSyntaxProperty("#{$Attr}-color"), "sass interpolation")
  t.notOk(isStandardSyntaxProperty("@{Attr}-color"), "less variable")
  t.end()
})
