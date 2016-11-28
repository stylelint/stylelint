"use strict"

const isKeyframeSelector = require("../isKeyframeSelector")
const test = require("tape")

test("isKeyframeSelector", t => {
  t.ok(isKeyframeSelector("to"), "to keyword")
  t.ok(isKeyframeSelector("from"), "from keyword")
  t.ok(isKeyframeSelector("0%"))
  t.ok(isKeyframeSelector("9%"))
  t.ok(isKeyframeSelector("26%"))
  t.ok(isKeyframeSelector("100%"))
  t.ok(isKeyframeSelector("27.5%"))
  t.ok(isKeyframeSelector("27.0009%"))
  t.ok(isKeyframeSelector(".5%"))
  t.ok(isKeyframeSelector("000.5%"))
  t.ok(isKeyframeSelector("209%"))

  t.notOk(isKeyframeSelector("a"))
  t.notOk(isKeyframeSelector(".foo"))
  t.notOk(isKeyframeSelector("#something"))
  t.notOk(isKeyframeSelector("100"))
  t.notOk(isKeyframeSelector("0.1"))
  t.notOk(isKeyframeSelector("1.0"))
  t.notOk(isKeyframeSelector("1a%"))

  t.end()
})
