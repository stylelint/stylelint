import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("", "empty string")

  tr.ok("\n", "no nodes")
  tr.notOk(" \n", messages.rejected(1), "no nodes with space before newline")

  tr.ok("a {}", "no newline")

  tr.ok("a::before { content: \"  \n\t\n\"; }", "breaking the rule within a string")

  tr.ok("a,\nb {}", "selector delimiter")
  tr.notOk("a, \nb {}", messages.rejected(1),
    "selector delimiter with space before newline")

  tr.ok("a\n{}", "before opening brace")
  tr.notOk("a\t\n{}", messages.rejected(1),
    "before opening brace with tab before newline")

  tr.ok("a {\n  color: pink; }", "after opening brace with space after newline")
  tr.notOk("a { \n  color: pink; }", messages.rejected(1),
    "after opening brace with space before and after newline")

  tr.ok("a { color: pink;\n}", "before closing brace")
  tr.notOk("a { color: pink; \n}", messages.rejected(1),
    "before closing brace with space before newline")

  tr.ok("a { color: pink; }\nb { color: orange; }", "after closing brace")
  tr.notOk("a { color: pink; }\t\nb { color: orange; }", messages.rejected(1),
    "after closing brace with tab before newline")

  tr.ok("a { color: pink; }\n\n\nb { color: orange; }",
    "multiple newlines after closing brace")
  tr.notOk("a { color: pink; } \n\n\nb { color: orange; }", messages.rejected(1))
  tr.notOk("a { color: pink; }\n \n\nb { color: orange; }", messages.rejected(2))
  tr.notOk("a { color: pink; }\n\n \nb { color: orange; }", messages.rejected(3))

  tr.ok("a { color: pink;\n  top: 0; }",
    "between declarations with two spaces after newline")
  tr.notOk("a { color: pink; \n  top: 0; }", messages.rejected(1),
    "between declarations with space before and two after newline")

  tr.ok("a { color:\n\tpink; }", "between properties and values with tab after newline")
  tr.notOk("a { color:\t\n\tpink; }", messages.rejected(1),
    "between properties and values with tab before and after newline")

  tr.ok("a { background-position: top left,\ntop right; }", "within values")
  tr.notOk("a { background-position: top left, \ntop right; }", messages.rejected(1),
    "within values with space before newline")

  tr.ok("@media print,\nscreen {}", "within media query list")
  tr.notOk("@media print, \nscreen {}", messages.rejected(1),
    "within media query list with space before newline")

  tr.ok("@media print {\n  a { color: pink; } }",
    "after opening brace of media query with space after newline")
  tr.notOk("@media print { \n  a { color: pink; } }", messages.rejected(1),
    "after opening brace of media query with space before and after newline")

  tr.ok("a\r{}", "carriage return opening brace")
  tr.notOk("a\t\r{}", messages.rejected(1),
    "tab before carriage return before opening brace")

  // Realistic lots-of-lines input
  tr.ok("a\n{\n\tcolor: pink;\n\ttop: 0;\n}")
  tr.notOk("a \n{\n\tcolor: pink;\n\ttop: 0;\n}", messages.rejected(1))
  tr.notOk("a\n{\t\n\tcolor: pink;\n\ttop: 0;\n}", messages.rejected(2))
  tr.notOk("a\n{\n\tcolor: pink; \n\ttop: 0;\n}", messages.rejected(3))
  tr.notOk("a\n{\n\tcolor: pink;\n\ttop: 0;  \n}", messages.rejected(4))

  tr.ok("@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}")
  tr.notOk(
    "@media print { \n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}",
    messages.rejected(1)
  )
  tr.notOk(
    "@media print {\n  a { \n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}",
    messages.rejected(2)
  )
  tr.notOk(
    "@media print {\n  a {\n  color: pink; \n  }\n}\n\n@media screen {\n  b { color: orange; }\n}",
    messages.rejected(3)
  )
  tr.notOk(
    "@media print {\n  a {\n  color: pink;\n  } \n}\n\n@media screen {\n  b { color: orange; }\n}",
    messages.rejected(4)
  )
  tr.notOk(
    "@media print {\n  a {\n  color: pink;\n  }\n} \n\n@media screen {\n  b { color: orange; }\n}",
    messages.rejected(5)
  )
  tr.notOk(
    "@media print {\n  a {\n  color: pink;\n  }\n}\n \n@media screen {\n  b { color: orange; }\n}",
    messages.rejected(6)
  )
  tr.notOk(
    "@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen { \n  b { color: orange; }\n}",
    messages.rejected(7)
  )
  tr.notOk(
    "@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; } \n}",
    messages.rejected(8)
  )
})
