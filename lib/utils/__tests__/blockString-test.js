"use strict"

const blockString = require("../blockString")
const postcss = require("postcss")
const test = require("tape")

test("blockString rules", t => {
  t.equal(postcssCheck("a { color: pink; }"), "{ color: pink; }")
  t.equal(postcssCheck("a {\n\tcolor: pink;\n\ttop: 0;\n}"), "{\n\tcolor: pink;\n\ttop: 0;\n}")
  t.end()
})

test("blockString at-rules", t => {
  t.equal(postcssCheck("@media print { a { color: pink; } }"), "{ a { color: pink; } }")
  t.equal(postcssCheck("@keyframes foo {\n  0% {\n  top: 0;\n}\n\n  100% {\n  top: 10px;\n}\n}\n"), "{\n  0% {\n  top: 0;\n}\n\n  100% {\n  top: 10px;\n}\n}")
  t.end()
})

function postcssCheck(cssString) {
  const root = postcss.parse(cssString)
  return blockString(root.first)
}
