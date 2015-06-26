import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a {} b {}", "non-nested node ignored")
  tr.ok("a {}\nb {}", "non-nested node ignored")
  tr.ok("@media {\n\n  a {}\n\n}")
  tr.ok("@media {\n\n  a {}\n\n  b{}\n\n}")
  tr.ok("@media {\n\n\ta {}\n\n\tb{}\n}")
  tr.ok("@media {\n\n\ta {}}")
  tr.ok("@media {\n\na {}\n/* comment */\n\nb {}}")

  tr.notOk("@media { b {} }", messages.expected)
  tr.notOk("@media {\n\n  b {} a {} }", messages.expected)
  tr.notOk("@media {\n\n  b {}\n  a {}\n\n}", messages.expected)
  tr.notOk("@media {\n  b {}\n\n  a {}\n\n}", messages.expected)
})

testRule("always", { except: ["first-nested"] }, tr => {
  warningFreeBasics(tr)

  tr.ok("a {} b {}", "non-nested node ignored")
  tr.ok("a {}\nb {}", "non-nested node ignored")
  tr.ok("@media {\n  a {}\n\n}")
  tr.ok("@media {\n  a {}\n\n  b{}\n\n}")
  tr.ok("@media {\n\ta {}\n\n\tb{}\n}")
  tr.ok("@media {\n\ta {}}")
  tr.ok("@media {\na {}\n/* comment */\n\nb {}}")

  tr.notOk("@media {\n\n  a {}\n}", messages.rejected)
  tr.notOk("@media {\n\n  a {}\n\n  b{}\n}", messages.rejected)
  tr.notOk("@media {\n  b {} a {} }", messages.expected)
  tr.notOk("@media {\n  b {}\n  a {}\n\n}", messages.expected)
})

testRule("always", { ignore: ["after-comment"] }, tr => {
  tr.ok("@media {\n  /* foo */\n  a {}\n}")
  tr.ok("@media {\n  /* foo */\n\n  a {}\n}")

  tr.notOk("@media {\n\n  a{}\n  b {}\n\n}", messages.expected)
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a {} b {}", "non-nested node ignored")
  tr.ok("a {}\nb {}", "non-nested node ignored")
  tr.ok("@media {\n  a {}\n}")
  tr.ok("@media {\n  a {} b{}\n}")
  tr.ok("@media {\n\ta {}\n\tb{}\n}")
  tr.ok("@media {\n\ta {}}")
  tr.ok("@media {\na {}\n/* comment */\nb {}}")

  tr.notOk("@media {\n\n  a {}\n\n}", messages.rejected)
  tr.notOk("@media {\n  a {}\n\n  b{}\n\n}", messages.rejected)
  tr.notOk("@media {\ta {}\n\n\tb{}\n}", messages.rejected)
  tr.notOk("@media {\n\n\ta {}}", messages.rejected)
  tr.notOk("@media {\na {}\n/* comment */\n\nb {}}", messages.rejected)
})

testRule("never", { ignore: ["after-comment"] }, tr => {
  tr.ok("@media {\n  /* foo */\n  a {}\n}")
  tr.ok("@media {\n  /* foo */\n\n  a {}\n}")

  tr.notOk("@media {\n  a{}\n\n  b {}\n}", messages.rejected)
})

testRule("always-multi-line", tr => {
  tr.ok("@media { a { color:pink; } b { top: 0; } }", "single-line ignored")
  warningFreeBasics(tr)

  tr.ok("a {} b {}", "non-nested node ignored")
  tr.ok("a {}\nb {}", "non-nested node ignored")
  tr.ok("@media {\n\n  a {\n    color: pink;\n}\n\n}")
  tr.ok("@media {\n\n  a {\n    color: pink;\n}\n\n  b {\n    top: 0;\n}\n\n}")
  tr.ok("@media {\n\n\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}")
  tr.ok("@media {\n\na {\n\t\tcolor: pink; }\n/* comment */\n\nb {\n\t\ttop: 0; }}")

  tr.notOk("@media {\n  a {\n    color: pink;\n}\n\n}", messages.expected)
  tr.notOk("@media {\n\n  a {\n    color: pink;\n}\n  b {\n    top: 0;\n}\n\n}", messages.expected)
  tr.notOk("@media {\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}", messages.expected)
  tr.notOk("@media {\n\na {\n\t\tcolor: pink; }\n/* comment */\nb {\n\t\ttop: 0; }}", messages.expected)
})

testRule("always-multi-line", { except: ["first-nested"] }, tr => {
  tr.ok("@media { a { color:pink; } b { top: 0; } }", "single-line ignored")
  warningFreeBasics(tr)

  tr.ok("a {} b {}", "non-nested node ignored")
  tr.ok("a {}\nb {}", "non-nested node ignored")
  tr.ok("@media {\n  a {\n    color: pink;\n}\n\n}")
  tr.ok("@media {\n  a {\n    color: pink;\n}\n\n  b {\n    top: 0;\n}\n\n}")
  tr.ok("@media {\n\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}")
  tr.ok("@media {\na {\n\t\tcolor: pink; }\n/* comment */\n\nb {\n\t\ttop: 0; }}")

  tr.notOk("@media {\n\n  a {\n    color: pink;\n}\n\n}", messages.rejected)
  tr.notOk("@media {\n  a {\n    color: pink;\n}\n  b {\n    top: 0;\n}\n\n}", messages.expected)
  tr.notOk("@media {\na {\n\t\tcolor: pink; }\n/* comment */\nb {\n\t\ttop: 0; }}", messages.expected)
})

testRule("never-multi-line", tr => {
  tr.ok("@media {\n\na { color:pink; }\n\nb { top: 0; } }", "single-line ignored")
  warningFreeBasics(tr)

  tr.ok("a {} b {}", "non-nested node ignored")
  tr.ok("a {}\nb {}", "non-nested node ignored")
  tr.ok("@media {\n  a {\n    color: pink;\n}\n}")
  tr.ok("@media {\n  a {\n    color: pink;\n}\n  b {\n    top: 0;\n}\n}")
  tr.ok("@media {\ta {\n\t\tcolor: pink; }\n\tb{\n\t\ttop: 0; }\n}")
  tr.ok("@media {\na {\n\t\tcolor: pink; }\n/* comment */\nb {\n\t\ttop: 0; }}")

  tr.notOk("@media {\n\n  a {\n    color: pink;\n}\n\n}", messages.rejected)
  tr.notOk("@media {\n\n  a {\n    color: pink;\n}\n  b {\n    top: 0;\n}\n\n}", messages.rejected)
  tr.notOk("@media {\ta {\n\t\tcolor: pink; }\n\n\tb{\n\t\ttop: 0; }\n}", messages.rejected)
  tr.notOk("@media { a {\n\t\tcolor: pink; }\n/* comment */\n\nb {\n\t\ttop: 0; }}", messages.rejected)
})
