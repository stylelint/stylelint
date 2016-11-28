"use strict"

const hasBlock = require("../hasBlock")
const postcss = require("postcss")
const test = require("tape")

test("hasBlock", t => {
  t.ok(postcssCheck("a {}"), "empty rule")
  t.ok(postcssCheck("a { }"), "emtpy rule with space")
  t.ok(postcssCheck("a {\n}"), "emtpy rule with newline")
  t.ok(postcssCheck("@media print {}"), "empty @media")
  t.ok(postcssCheck("@supports (animation-name: test) {}"), "empty @supports")
  t.ok(postcssCheck("@document url(http://www.w3.org/) {}"), "empty @document")
  t.ok(postcssCheck("@page :pseudo-class {}"), "empty page")
  t.ok(postcssCheck("@font-face {}"), "empty font-face")
  t.ok(postcssCheck("@keyframes identifier {}"), "empty keyframes")

  t.ok(postcssCheck("a { color: pink; }"), "not empty rule")
  t.ok(postcssCheck("@media print { a { color: pink; } }"), "not empty @media")
  t.ok(postcssCheck("@supports (animation-name: test) { a { color: pink; } }"), "not empty @supports")
  t.ok(postcssCheck("@document url(http://www.w3.org/) { a { color: pink; } }"), "not empty @document")
  t.ok(postcssCheck("@page :pseudo-class { a { color: pink; } }"), "not empty @page")
  t.ok(postcssCheck("@font-face { font-family: sans; }"), "not empty @font-face")
  t.ok(postcssCheck("@keyframes identifier { 0% { top: 0; left:} }"), "not empty @keyframes")

  t.notOk(postcssCheck("@import url(x.css)"), "@import url")
  t.notOk(postcssCheck("@import 'x.css'"), "@import single quoted string")
  t.notOk(postcssCheck("@import \"x.css\""), "@import double quoted string")
  t.notOk(postcssCheck("@charset \"UTF-8\""), "@charset")
  t.notOk(postcssCheck("@namespace url(http://www.w3.org/1999/xhtml)"), "@namespace")
  t.notOk(postcssCheck("@namespace svg url(http://www.w3.org/2000/svg)"), "@namespace with prefix")

  t.end()
})

function postcssCheck(cssString) {
  const root = postcss.parse(cssString)
  return hasBlock(root.first)
}
