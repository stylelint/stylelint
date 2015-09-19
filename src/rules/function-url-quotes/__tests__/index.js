import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("double", tr => {
  warningFreeBasics(tr)

  // at-rules
  tr.ok("@import url(\"foo.css\");", {
    message: messages.expected("double quotes"),
    line: 1,
    column: 14,
  })
  tr.notOk(
    "@import url('foo.css');",
    {
      message: messages.expected("double quotes"),
      line: 1,
      column: 13,
    }
  )
  tr.notOk(
    "@import url(foo.css);",
    {
      message: messages.expected("double quotes"),
      line: 1,
      column: 13,
    }
  )

  tr.ok("@document url(\"http://www.w3.org/\");")
  tr.ok("@document url-prefix(\"http://www.w3.org/\");")
  tr.ok("@document domain(\"http://www.w3.org/\");")
  tr.notOk(
    "@document url('http://www.w3.org/');",
    {
      message: messages.expected("double quotes"),
      line: 1,
      column: 15,
    }
  )
  tr.notOk(
    "@document url-prefix(http://www.w3.org/Style);",
    {
      message: messages.expected("double quotes", "url-prefix"),
      line: 1,
      column: 22,
    }
  )
  tr.notOk(
    "@document domain('mozilla.org');",
    {
      message: messages.expected("double quotes", "domain"),
      line: 1,
      column: 18,
    }
  )

  tr.ok("@font-face { font-family: 'foo'; src: url(\"foo.ttf\"); }")
  tr.notOk(
    "@font-face { font-family: 'foo'; src: url(foo.ttf); }",
    {
      message: messages.expected("double quotes"),
      line: 1,
      column: 43,
    }
  )

  // rules
  tr.ok("a { background: url(\"foo.css\"); }")
  tr.notOk(
    "a { background: url('foo.css'); }",
    {
      message: messages.expected("double quotes"),
      line: 1,
      column: 21,
    }
  )
  tr.ok("a { cursor: url(\"foo.png\"); }")
  tr.notOk(
    "a { cursor: url(foo.png); }",
    {
      message: messages.expected("double quotes"),
      line: 1,
      column: 17,
    }
  )
  tr.ok("a { background-image: url(\"foo.css\"), url(\"bar.css\"), url(\"baz.css\"); }")
  tr.notOk(
    "a { background-image: url(foo.css), url(\"bar.css\"), url(\"baz.css\"); }",
    {
      message: messages.expected("double quotes"),
      line: 1,
      column: 27,
    }
  )
  tr.notOk(
    "a { background-image: url(\"foo.css\"), url(bar.css), url(\"baz.css\"); }",
    {
      message: messages.expected("double quotes"),
      line: 1,
      column: 43,
    }
  )
  tr.notOk(
    "a { background-image: url(\"foo.css\"), url(\"bar.css\"), url(baz.css); }",
    {
      message: messages.expected("double quotes"),
      line: 1,
      column: 59,
    }
  )
})

testRule("single", tr => {
  warningFreeBasics(tr)

  // at-rules
  tr.ok("@import url('foo.css');")
  tr.notOk("@import url(\"foo.css\");", {
    message: messages.expected("single quotes"),
    line: 1,
    column: 13,
  })
  tr.notOk("@import url(foo.css);", {
    message: messages.expected("single quotes"),
    line: 1,
    column: 13,
  })

  tr.ok("@document url('http://www.w3.org/');")
  tr.ok("@document url-prefix('http://www.w3.org/');")
  tr.ok("@document domain('http://www.w3.org/');")
  tr.notOk(
    "@document url(\"http://www.w3.org/\");",
    {
      message: messages.expected("single quotes"),
      line: 1,
      column: 15,
    }
  )
  tr.notOk(
    "@document url-prefix(http://www.w3.org/Style);",
    {
      message: messages.expected("single quotes", "url-prefix"),
      line: 1,
      column: 22,
    }
  )
  tr.notOk(
    "@document domain(\"mozilla.org\");",
    {
      message: messages.expected("single quotes", "domain"),
      line: 1,
      column: 18,
    }
  )

  tr.ok("@font-face { font-family: 'foo'; src: url('foo.ttf'); }")
  tr.notOk(
    "@font-face { font-family: 'foo'; src: url(foo.ttf); }",
    {
      message: messages.expected("single quotes"),
      line: 1,
      column: 43,
    }
  )

  // rules
  tr.ok("a { background: url('foo.css'); }")
  tr.notOk(
    "a { background: url(\"foo.css\"); }",
    {
      message: messages.expected("single quotes"),
      line: 1,
      column: 21,
    }
  )
  tr.ok("a { cursor: url('foo.png'); }")
  tr.notOk(
    "a { cursor: url(foo.png); }",
    {
      message: messages.expected("single quotes"),
      line: 1,
      column: 17,
    }
  )
  tr.ok("a { background-image: url('foo.css'), url('bar.css'), url('baz.css'); }")
  tr.notOk(
    "a { background-image: url(foo.css), url('bar.css'), url('baz.css'); }",
    {
      message: messages.expected("single quotes"),
      line: 1,
      column: 27,
    }
  )
  tr.notOk(
    "a { background-image: url('foo.css'), url(bar.css), url('baz.css'); }",
    {
      message: messages.expected("single quotes"),
      line: 1,
      column: 43,
    }
  )
  tr.notOk(
    "a { background-image: url('foo.css'), url('bar.css'), url(baz.css); }",
    {
      message: messages.expected("single quotes"),
      line: 1,
      column: 59,
    }
  )
})

testRule("none", tr => {
  warningFreeBasics(tr)

  // at-rules
  tr.ok("@import url(foo.css);")
  tr.notOk(
    "@import url(\"foo.css\");",
    {
      message: messages.expected("no quotes"),
      line: 1,
      column: 13,
    }
  )
  tr.notOk(
    "@import url('foo.css');",
    {
      message: messages.expected("no quotes"),
      line: 1,
      column: 13,
    }
  )

  tr.ok("@document url(http://www.w3.org/);")
  tr.ok("@document url-prefix(http://www.w3.org/);")
  tr.ok("@document domain(http://www.w3.org/);")
  tr.notOk(
    "@document url(\"http://www.w3.org/\");",
    {
      message: messages.expected("no quotes"),
      line: 1,
      column: 15,
    }
  )
  tr.notOk(
    "@document url-prefix('http://www.w3.org/Style');",
    {
      message: messages.expected("no quotes", "url-prefix"),
      line: 1,
      column: 22,
    }
  )
  tr.notOk(
    "@document domain(\"mozilla.org\");",
    {
      message: messages.expected("no quotes", "domain"),
      line: 1,
      column: 18,
    }
  )

  tr.ok("@font-face { font-family: foo; src: url(foo.ttf); }")
  tr.notOk(
    "@font-face { font-family: foo; src: url('foo.ttf'); }",
    {
      message: messages.expected("no quotes"),
      line: 1,
      column: 41,
    }
  )

  // rules
  tr.ok("a { background: url(foo.css); }")
  tr.notOk(
    "a { background: url(\"foo.css\"); }",
    {
      message: messages.expected("no quotes"),
      line: 1,
      column: 21,
    }
  )
  tr.ok("a { cursor: url(foo.png); }")
  tr.notOk(
    "a { cursor: url(\"foo.png\"); }",
    {
      message: messages.expected("no quotes"),
      line: 1,
      column: 17,
    }
  )
  tr.ok("a { background-image: url(foo.css), url(bar.css), url(baz.css); }")
  tr.notOk(
    "a { background-image: url('foo.css'), url(bar.css), url(baz.css); }",
    {
      message: messages.expected("no quotes"),
      line: 1,
      column: 27,
    }
  )
  tr.notOk(
    "a { background-image: url(foo.css), url('bar.css'), url(baz.css); }",
    {
      message: messages.expected("no quotes"),
      line: 1,
      column: 41,
    }
  )
  tr.notOk(
    "a { background-image: url(foo.css), url(bar.css), url('baz.css'); }",
    {
      message: messages.expected("no quotes"),
      line: 1,
      column: 55,
    }
  )
})
