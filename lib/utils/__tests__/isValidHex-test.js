"use strict"

const isValidHex = require("../isValidHex")
const test = require("tape")

test("isValidHex", t => {
  t.ok(isValidHex("#333"))
  t.ok(isValidHex("#a3b"))
  t.ok(isValidHex("#333a"))
  t.ok(isValidHex("#333afe"))
  t.ok(isValidHex("#333afeaa"))
  t.notOk(isValidHex("a"))
  t.notOk(isValidHex("aaa"))
  t.notOk(isValidHex("$aaa"))
  t.notOk(isValidHex("@aaa"))
  t.notOk(isValidHex("var(aaa)"))
  t.notOk(isValidHex("#z1"))
  t.notOk(isValidHex("#00000"))
  t.notOk(isValidHex("#000000000"))
  t.notOk(isValidHex("#33z"))
  t.end()
})
