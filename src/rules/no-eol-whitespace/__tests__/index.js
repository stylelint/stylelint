import {
  ruleTester,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  tr.ok("", "empty string")

  tr.ok("\n", "no nodes")
  tr.notOk(" \n", {
    message: messages.rejected,
    line: 1,
    column: 1,
  }, "no nodes with space before newline")

  tr.ok("a {}", "no newline")

  tr.ok("a::before { content: \"  \n\t\n\"; }", "breaking the rule within a string")

  tr.notOk(
    "/* foo  \nbar */ a { color: pink; }",
    {
      message: messages.rejected,
      line: 1,
      column: 8,
    },
    "eol-whitespace within a comment"
  )

  tr.ok("a,\nb {}", "selector delimiter")
  tr.notOk("a, \nb {}", {
    message: messages.rejected,
    line: 1,
    column: 3,
  },
    "selector delimiter with space before newline")

  tr.ok("a\n{}", "before opening brace")
  tr.notOk("a\t\n{}", {
    message: messages.rejected,
    line: 1,
    column: 2,
  },
    "before opening brace with tab before newline")

  tr.ok("a {\n  color: pink; }", "after opening brace with space after newline")
  tr.notOk("a { \n  color: pink; }", {
    message: messages.rejected,
    line: 1,
    column: 4,
  },
    "after opening brace with space before and after newline")

  tr.ok("a { color: pink;\n}", "before closing brace")
  tr.notOk("a { color: pink; \n}", {
    message: messages.rejected,
    line: 1,
    column: 17,
  },
    "before closing brace with space before newline")

  tr.ok("a { color: pink; }\nb { color: orange; }", "after closing brace")
  tr.notOk("a { color: pink; }\t\nb { color: orange; }", {
    message: messages.rejected,
    line: 1,
    column: 19,
  },
    "after closing brace with tab before newline")

  tr.ok("a { color: pink; }\n\n\nb { color: orange; }",
    "multiple newlines after closing brace")
  tr.notOk("a { color: pink; } \n\n\nb { color: orange; }", {
    message: messages.rejected,
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; }\n \n\nb { color: orange; }", {
    message: messages.rejected,
    line: 2,
    column: 1,
  })
  tr.notOk("a { color: pink; }\n\n \nb { color: orange; }", {
    message: messages.rejected,
    line: 3,
    column: 1,
  })

  tr.ok("a { color: pink;\n  top: 0; }",
    "between declarations with two spaces after newline")
  tr.notOk("a { color: pink; \n  top: 0; }", {
    message: messages.rejected,
    line: 1,
    column: 17,
  },
    "between declarations with space before and two after newline")

  tr.ok("a { color:\n\tpink; }", "between properties and values with tab after newline")
  tr.notOk("a { color:\t\n\tpink; }", {
    message: messages.rejected,
    line: 1,
    column: 11,
  },
    "between properties and values with tab before and after newline")

  tr.ok("a { background-position: top left,\ntop right; }", "within values")
  tr.notOk("a { background-position: top left, \ntop right; }", {
    message: messages.rejected,
    line: 1,
    column: 35,
  },
    "within values with space before newline")

  tr.ok("@media print,\nscreen {}", "within media query list")
  tr.notOk("@media print, \nscreen {}", {
    message: messages.rejected,
    line: 1,
    column: 14,
  },
    "within media query list with space before newline")

  tr.ok("@media print {\n  a { color: pink; } }",
    "after opening brace of media query with space after newline")
  tr.notOk("@media print { \n  a { color: pink; } }", {
    message: messages.rejected,
    line: 1,
    column: 15,
  },
    "after opening brace of media query with space before and after newline")

  tr.ok("a\r{}", "carriage return opening brace")
  tr.notOk("a\t\r{}", {
    message: messages.rejected,
    line: 1,
    column: 2,
  },
    "tab before carriage return before opening brace")

  // Realistic lots-of-lines input
  tr.ok("a\n{\n\tcolor: pink;\n\ttop: 0;\n}")
  tr.notOk("a \n{\n\tcolor: pink;\n\ttop: 0;\n}", {
    message: messages.rejected,
    line: 1,
    column: 2,
  })
  tr.notOk("a\n{\t\n\tcolor: pink;\n\ttop: 0;\n}", {
    message: messages.rejected,
    line: 2,
    column: 2,
  })
  tr.notOk("a\n{\n\tcolor: pink; \n\ttop: 0;\n}", {
    message: messages.rejected,
    line: 3,
    column: 14,
  })
  tr.notOk("a\n{\n\tcolor: pink;\n\ttop: 0;  \n}", {
    message: messages.rejected,
    line: 4,
    column: 10,
  })

  tr.ok("@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}")
  tr.notOk(
    "@media print { \n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}",
    {
      message: messages.rejected,
      line: 1,
      column: 15,
    }
  )
  tr.notOk(
    "@media print {\n  a { \n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; }\n}",
    {
      message: messages.rejected,
      line: 2,
      column: 6,
    }
  )
  tr.notOk(
    "@media print {\n  a {\n  color: pink; \n  }\n}\n\n@media screen {\n  b { color: orange; }\n}",
    {
      message: messages.rejected,
      line: 3,
      column: 15,
    }
  )
  tr.notOk(
    "@media print {\n  a {\n  color: pink;\n  } \n}\n\n@media screen {\n  b { color: orange; }\n}",
    {
      message: messages.rejected,
      line: 4,
      column: 4,
    }
  )
  tr.notOk(
    "@media print {\n  a {\n  color: pink;\n  }\n} \n\n@media screen {\n  b { color: orange; }\n}",
    {
      message: messages.rejected,
      line: 5,
      column: 2,
    }
  )
  tr.notOk(
    "@media print {\n  a {\n  color: pink;\n  }\n}\n \n@media screen {\n  b { color: orange; }\n}",
    {
      message: messages.rejected,
      line: 6,
      column: 1,
    }
  )
  tr.notOk(
    "@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen { \n  b { color: orange; }\n}",
    {
      message: messages.rejected,
      line: 7,
      column: 16,
    }
  )
  tr.notOk(
    "@media print {\n  a {\n  color: pink;\n  }\n}\n\n@media screen {\n  b { color: orange; } \n}",
    {
      message: messages.rejected,
      line: 8,
      column: 23,
    }
  )
})
