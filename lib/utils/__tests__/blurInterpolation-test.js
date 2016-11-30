"use strict"

const blurInterpolation = require("../blurInterpolation")
const test = require("tape")

test("blurInterpolation", t => {
  t.equal(blurInterpolation("#{$selector}"), " $selector ")
  t.equal(blurInterpolation("#{$selector}", "`"), "`$selector`")
  t.equal(blurInterpolation("#{$selector * 10px}"), " $selector * 10px ")
  t.equal(blurInterpolation("#{$font-size}/#{$line-height}"), " $font-size / $line-height ")
  t.equal(blurInterpolation("url(#{$selector * 10px})"), "url( $selector * 10px )")
  t.equal(blurInterpolation("calc(#{$selector} * 2)"), "calc( $selector  * 2)")
  t.equal(blurInterpolation("filter: progid:DXImageTransform.Microsoft.gradient(enabled='false', startColorstr='#{ie-hex-str($green)}', endColorstr='#{ie-hex-str($translucent-red)}');"), "filter: progid:DXImageTransform.Microsoft.gradient(enabled='false', startColorstr=' ie-hex-str($green) ', endColorstr=' ie-hex-str($translucent-red) ');")
  t.equal(blurInterpolation("\"I ate #{5 + 10} pies!\""), "\"I ate  5 + 10  pies!\"")
  t.equal(blurInterpolation("@{variable}"), " variable ")
  t.end()
})
