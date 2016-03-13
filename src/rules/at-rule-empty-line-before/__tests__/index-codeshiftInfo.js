// Original file:
import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

function sharedAlwaysTests(tr) {
  warningFreeBasics(tr)

  tr.ok("a {} b {}", "rule ignored")
  tr.ok("@font-face {}", "first node ignored")
  tr.ok("a {}\n\n@media {}")
  tr.ok("@keyframes foo {}\n\n@media {}")
  tr.ok("a {}\r\n\r\n@media {}", "windows")

  tr.notOk("a {} @media {}", messages.expected)
  tr.notOk("@keyframes foo {} @media {}", messages.expected)
  tr.notOk("a {}\n@media {}", messages.expected)
  tr.notOk("a {}\r\n@media {}", messages.expected)
  tr.notOk("a {}\n\n/* comment */\n@media {}", messages.expected)
  tr.notOk("a {}\r\n\r\n/* comment */\r\n@media {}", messages.expected)
}

testRule("always", tr => {
  sharedAlwaysTests(tr)

  tr.ok("a {\n\n  @mixin foo;\n}")
})

testRule("always", { except: ["blockless-group"] }, tr => {
  sharedAlwaysTests(tr)

  tr.ok("a {\n\n  @mixin foo;\n}")

  tr.ok("@keyframes foo {}\n\n@import 'x.css'", "empty line not blockless pair")
  tr.ok("@import 'x.css';\n@import 'y.css'", "no empty line blockless pair")
  tr.ok("@import 'x.css';", "single blockless rule")

  tr.notOk("@keyframes foo {}\n@import 'x.css'", messages.expected)
  tr.notOk("@import 'x.css';\n\n@import 'y.css'", messages.rejected)
})

testRule("always", { ignore: ["after-comment"] }, tr => {
  tr.ok("/* foo */\n@media {}")
  tr.ok("/* foo */\n\n@media{}")
  tr.ok("/* foo */\r\n\r\n@media {}", "CRLF")

  tr.notOk("a {} @media {}", messages.expected)
})

testRule("always", { except: ["all-nested"] }, tr => {
  sharedAlwaysTests(tr)

  tr.ok("a {\n  @mixin foo;\n  color: pink;\n}")
  tr.ok("a {\n  color: pink;\n  @mixin foo;\n}")

  tr.notOk("a {\n\n  @mixin foo;\n  color: pink;\n}", messages.rejected)
  tr.notOk("a {\n\n  color: pink;\n\n  @mixin foo;\n}", messages.rejected)
})

testRule("always", { except: ["first-nested"] }, tr => {
  sharedAlwaysTests(tr)

  tr.ok("a {\n  @mixin foo;\n  color: pink;\n}")

  tr.notOk("a {\n  color: pink;\n  @mixin foo;\n}", messages.expected)
  tr.notOk("a {\n\n  @mixin foo;\n  color: pink;\n}", messages.rejected)
})

testRule("always", { ignore: ["all-nested"] }, tr => {
  sharedAlwaysTests(tr)

  tr.ok("a {\n  @mixin foo;\n  color: pink;\n}")
  tr.ok("a {\n  color: pink;\n  @mixin foo;\n}")
  tr.ok("a {\n\n  @mixin foo;\n  color: pink;\n}")
  tr.ok("a {\n\n  color: pink;\n\n  @mixin foo;\n}")
})

testRule("always", { except: [ "blockless-group", "all-nested" ] }, tr => {
  sharedAlwaysTests(tr)

  tr.ok("a {\n  @mixin foo;\n  color: pink;\n}")
  tr.ok("a {\n  color: pink;\n  @mixin foo;\n}")
  tr.ok("@keyframes foo {}\n\n@import 'x.css'", "empty line not blockless pair")
  tr.ok("@import 'x.css';\n@import 'y.css'", "no empty line blockless pair")
  tr.ok("@import 'x.css';", "single blockless rule")

  tr.notOk("@keyframes foo {}\n@import 'x.css'", messages.expected)
  tr.notOk("@import 'x.css';\n\n@import 'y.css'", messages.rejected)
  tr.notOk("a {\n\n  @mixin foo;\n  color: pink;\n}", messages.rejected)
  tr.notOk("a {\n\n  color: pink;\n\n  @mixin foo;\n}", messages.rejected)

  tr.ok("a {\n  @mixin foo;\n  @mixin bar;\n}")
})

function sharedNeverTests(tr) {
  warningFreeBasics(tr)

  tr.ok("a {}\n\nb {}", "rule ignored")
  tr.ok("\n\n@font-face {}", "first node ignored")
  tr.ok("a {}\n@media {}")
  tr.ok("a {} @media {}")
  tr.ok("@keyframes foo {}\n@media {}")
  tr.ok("@keyframes foo {} @media {}")

  tr.notOk("a {}\n\n@media {}", messages.rejected)
  tr.notOk("@keyframes foo {}\n/* comment */\n\n@media {}", messages.rejected)
}

testRule("never", tr => {
  sharedNeverTests(tr)
  tr.ok("a {\n  @mixin foo;\n}")
})

testRule("never", { except: ["blockless-group"] }, tr => {
  sharedNeverTests(tr)
  tr.ok("a {\n  @mixin foo;\n}")

  tr.ok("@keyframes foo {}\n@import 'x.css'", "no empty line not blockless pair")
  tr.ok("@import 'x.css';\n\n@import 'y.css'", "empty line blockless pair")
  tr.ok("@import 'x.css';", "single blockless rule")

  tr.notOk("@keyframes foo {}\n\n@import 'x.css'", messages.rejected)
  tr.notOk("@import 'x.css';\n@import 'y.css'", messages.expected)
})

testRule("never", { except: ["all-nested"] }, tr => {
  sharedNeverTests(tr)

  tr.ok("a {\n\n  @mixin foo;\n  color: pink;\n}")
  tr.ok("a {\n  color: pink;\n\n  @mixin foo;\n}")

  tr.notOk("a {\n  @mixin foo;\n  color: pink;\n}", messages.expected)
  tr.notOk("a {\n\n  color: pink;\n  @mixin foo;\n}", messages.expected)
})

testRule("never", { except: ["first-nested"] }, tr => {
  sharedNeverTests(tr)

  tr.ok("a {\n\n  @mixin foo;\n  color: pink;\n}")

  tr.notOk("a {\n  color: pink;\n\n  @mixin foo;\n}", messages.rejected)
  tr.notOk("a {\n  @mixin foo;\n  color: pink;\n}", messages.expected)
})

testRule("never", { ignore: ["after-comment"] }, tr => {
  tr.ok("/* foo */\n@media {}")
  tr.ok("/* foo */\r\na@media {}", "CRLF")
  tr.ok("/* foo */\n\n@media {}")

  tr.notOk("b {}\n\n@media {}", messages.rejected)
  tr.notOk("b {}\r\n\r\n@media {}", messages.rejected, "CRLF")
})

testRule("never", { ignore: ["all-nested"] }, tr => {
  sharedNeverTests(tr)

  tr.ok("a {\n  @mixin foo;\n  color: pink;\n}")
  tr.ok("a {\n  color: pink;\n  @mixin foo;\n}")
  tr.ok("a {\n\n  @mixin foo;\n  color: pink;\n}")
  tr.ok("a {\n\n  color: pink;\n\n  @mixin foo;\n}")
})


// Schematization of "sharedAlwaysTests":
const schematizedSharedAlwaysTests = {
  accept: [{
    code: "a {} b {}",
    description: "rule ignored",
  }, {
    code: "@font-face {}",
    description: "first node ignored",
  }, {
    code: "a {}\n\n@media {}",
  }, {
    code: "@keyframes foo {}\n\n@media {}",
  }, {
    code: "a {}\r\n\r\n@media {}",
    description: "windows",
  }],

  reject: [{
    code: "a {} @media {}",
    message: messages.expected,
  }, {
    code: "@keyframes foo {} @media {}",
    message: messages.expected,
  }, {
    code: "a {}\n@media {}",
    message: messages.expected,
  }, {
    code: "a {}\r\n@media {}",
    message: messages.expected,
  }, {
    code: "a {}\n\n/* comment */\n@media {}",
    message: messages.expected,
  }, {
    code: "a {}\r\n\r\n/* comment */\r\n@media {}",
    message: messages.expected,
  }],
}

// Schematization of "sharedNeverTests":
const schematizedSharedNeverTests = {
  accept: [{
    code: "a {}\n\nb {}",
    description: "rule ignored",
  }, {
    code: "\n\n@font-face {}",
    description: "first node ignored",
  }, {
    code: "a {}\n@media {}",
  }, {
    code: "a {} @media {}",
  }, {
    code: "@keyframes foo {}\n@media {}",
  }, {
    code: "@keyframes foo {} @media {}",
  }],

  reject: [{
    code: "a {}\n\n@media {}",
    message: messages.rejected,
  }, {
    code: "@keyframes foo {}\n/* comment */\n\n@media {}",
    message: messages.rejected,
  }],
}