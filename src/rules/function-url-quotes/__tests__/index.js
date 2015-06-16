import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("double", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")

  // at-rules
  tr.ok("@import url(\"foo.css\");", messages.expected("double quotes"))
  tr.notOk("@import url('foo.css');", messages.expected("double quotes"))
  tr.notOk("@import url(foo.css);", messages.expected("double quotes"))

  tr.ok("@document url(\"http://www.w3.org/\");")
  tr.ok("@document url-prefix(\"http://www.w3.org/\");")
  tr.ok("@document domain(\"http://www.w3.org/\");")
  tr.notOk("@document url('http://www.w3.org/');", messages.expected("double quotes"))
  tr.notOk("@document url-prefix(http://www.w3.org/Style);",
    messages.expected("double quotes", "url-prefix"))
  tr.notOk("@document domain('mozilla.org');",
    messages.expected("double quotes", "domain"))

  tr.ok("@font-face { font-family: 'foo'; src: url(\"foo.ttf\"); }")
  tr.notOk("@font-face { font-family: 'foo'; src: url(foo.ttf); }",
    messages.expected("double quotes"))

  // rules
  tr.ok("a { background: url(\"foo.css\"); }")
  tr.notOk("a { background: url('foo.css'); }", messages.expected("double quotes"))
  tr.ok("a { cursor: url(\"foo.png\"); }")
  tr.notOk("a { cursor: url(foo.png); }", messages.expected("double quotes"))
  tr.ok("a { background-image: url(\"foo.css\"), url(\"bar.css\"), url(\"baz.css\"); }")
  tr.notOk("a { background-image: url(foo.css), url(\"bar.css\"), url(\"baz.css\"); }",
    messages.expected("double quotes"))
  tr.notOk("a { background-image: url(\"foo.css\"), url(bar.css), url(\"baz.css\"); }",
    messages.expected("double quotes"))
  tr.notOk("a { background-image: url(\"foo.css\"), url(\"bar.css\"), url(baz.css); }",
    messages.expected("double quotes"))
})

testRule("single", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")

  // at-rules
  tr.ok("@import url('foo.css');", messages.expected("single quotes"))
  tr.notOk("@import url(\"foo.css\");", messages.expected("single quotes"))
  tr.notOk("@import url(foo.css);", messages.expected("single quotes"))

  tr.ok("@document url('http://www.w3.org/');")
  tr.ok("@document url-prefix('http://www.w3.org/');")
  tr.ok("@document domain('http://www.w3.org/');")
  tr.notOk("@document url(\"http://www.w3.org/\");", messages.expected("single quotes"))
  tr.notOk("@document url-prefix(http://www.w3.org/Style);",
    messages.expected("single quotes", "url-prefix"))
  tr.notOk("@document domain(\"mozilla.org\");",
    messages.expected("single quotes", "domain"))

  tr.ok("@font-face { font-family: 'foo'; src: url('foo.ttf'); }")
  tr.notOk("@font-face { font-family: 'foo'; src: url(foo.ttf); }", messages.expected("single quotes"))

  // rules
  tr.ok("a { background: url('foo.css'); }")
  tr.notOk("a { background: url(\"foo.css\"); }", messages.expected("single quotes"))
  tr.ok("a { cursor: url('foo.png'); }")
  tr.notOk("a { cursor: url(foo.png); }", messages.expected("single quotes"))
  tr.ok("a { background-image: url('foo.css'), url('bar.css'), url('baz.css'); }")
  tr.notOk("a { background-image: url(foo.css), url('bar.css'), url('baz.css'); }",
    messages.expected("single quotes"))
  tr.notOk("a { background-image: url('foo.css'), url(bar.css), url('baz.css'); }",
    messages.expected("single quotes"))
  tr.notOk("a { background-image: url('foo.css'), url('bar.css'), url(baz.css); }",
    messages.expected("single quotes"))
})

testRule("none", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")

  // at-rules
  tr.ok("@import url(foo.css);", messages.expected("no quotes"))
  tr.notOk("@import url(\"foo.css\");", messages.expected("no quotes"))
  tr.notOk("@import url('foo.css');", messages.expected("no quotes"))

  tr.ok("@document url(http://www.w3.org/);")
  tr.ok("@document url-prefix(http://www.w3.org/);")
  tr.ok("@document domain(http://www.w3.org/);")
  tr.notOk("@document url(\"http://www.w3.org/\");", messages.expected("no quotes"))
  tr.notOk("@document url-prefix('http://www.w3.org/Style');",
    messages.expected("no quotes", "url-prefix"))
  tr.notOk("@document domain(\"mozilla.org\");",
    messages.expected("no quotes", "domain"))

  tr.ok("@font-face { font-family: foo; src: url(foo.ttf); }")
  tr.notOk("@font-face { font-family: foo; src: url('foo.ttf'); }", messages.expected("no quotes"))

  // rules
  tr.ok("a { background: url(foo.css); }")
  tr.notOk("a { background: url(\"foo.css\"); }", messages.expected("no quotes"))
  tr.ok("a { cursor: url(foo.png); }")
  tr.notOk("a { cursor: url(\"foo.png\"); }", messages.expected("no quotes"))
  tr.ok("a { background-image: url(foo.css), url(bar.css), url(baz.css); }")
  tr.notOk("a { background-image: url('foo.css'), url(bar.css), url(baz.css); }",
    messages.expected("no quotes"))
  tr.notOk("a { background-image: url(foo.css), url('bar.css'), url(baz.css); }",
    messages.expected("no quotes"))
  tr.notOk("a { background-image: url(foo.css), url(bar.css), url('baz.css'); }",
    messages.expected("no quotes"))
})
