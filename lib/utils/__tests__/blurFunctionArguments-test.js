"use strict"

const blurFunctionArguments = require("../blurFunctionArguments")
const test = require("tape")

test("blurFunctionArguments", t => {
  t.equal(blurFunctionArguments("abc abc", "url"), "abc abc")
  t.equal(blurFunctionArguments("abc url(abc) abc", "url"), "abc url(```) abc")
  t.equal(blurFunctionArguments("abc uRl(abc) abc", "url"), "abc uRl(```) abc")
  t.equal(blurFunctionArguments("abc URL(abc) abc", "url"), "abc URL(```) abc")
  t.equal(blurFunctionArguments("abc url(abc) url(xx)", "url", "#"), "abc url(###) url(##)")
  t.end()
})
