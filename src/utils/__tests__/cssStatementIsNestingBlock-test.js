import cssStatementIsNestingBlock from "../cssStatementIsNestingBlock"
import postcss from "postcss"
import test from "tape"

test("cssStatementIsNestingBlock", t => {

  t.ok(postcssCheck("a {{ &:hover { color: pink; }}}"), "nesting without first level")
  t.ok(postcssCheck("a { color: red; { &:hover { color: pink; }}}"), "nesting with first level")

  t.notOk(postcssCheck("a {}"), "empty rule")
  t.notOk(postcssCheck("a { color: pink; }"), "not empty rule")
  t.notOk(postcssCheck("@media print { a { color: pink; } }"), "not empty @media")
  t.notOk(postcssCheck("@supports (animation-name: test) { a { color: pink; } }"), "not empty @supports")
  t.notOk(postcssCheck("@document url(http://www.w3.org/) { a { color: pink; } }"), "not empty @document")
  t.notOk(postcssCheck("@page :pseudo-class { a { color: pink; } }"), "not empty @page")
  t.notOk(postcssCheck("@font-face { font-family: sans; }"), "not empty @font-face")
  t.notOk(postcssCheck("@keyframes identifier { 0% { top: 0; left:} }"), "not empty @keyframes")

  t.end()
})

function postcssCheck(cssString) {
  const root = postcss.parse(cssString)
  let isNestingBlock = false
  root.walkRules(rule => {
    if (cssStatementIsNestingBlock(rule)) {
      isNestingBlock = true
      return false
    }
  })
  root.walkAtRules(atRule => {
    if (cssStatementIsNestingBlock(atRule)) {
      isNestingBlock = true
      return false
    }
  })
  return isNestingBlock
}
