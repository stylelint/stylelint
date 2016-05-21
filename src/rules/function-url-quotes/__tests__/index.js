import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

import postcss from "postcss"
import test from "tape"
import stylelint from "../../.."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "@import url(\"foo.css\");",

    description: {
      message: messages.expected("quotes"),
      line: 1,
      column: 14,
    },
  }, {
    code: "@import uRl(\"foo.css\");",

    description: {
      message: messages.expected("quotes"),
      line: 1,
      column: 14,
    },
  }, {
    code: "@import URL(\"foo.css\");",

    description: {
      message: messages.expected("quotes"),
      line: 1,
      column: 14,
    },
  }, {
    code: "@import url( \"foo.css\" );",

    description: {
      message: messages.expected("quotes"),
      line: 1,
      column: 15,
    },
  }, {
    code: "@document url(\"http://www.w3.org/\");",
  },  {
    code: "@document url( \"http://www.w3.org/\" );",
  }, {
    code: "@document url-prefix(\"http://www.w3.org/\");",
  }, {
    code: "@document url-prefix( \"http://www.w3.org/\" );",
  }, {
    code: "@document domain(\"http://www.w3.org/\");",
  }, {
    code: "@document domain( \"http://www.w3.org/\" );",
  }, {
    code: "@font-face { font-family: 'foo'; src: url(\"foo.ttf\"); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url( \"foo.ttf\" ); }",
  }, {
    code: "a { background: url(\"foo.css\"); }",
  }, {
    code: "a { background: uRl(\"foo.css\"); }",
  }, {
    code: "a { background: URL(\"foo.css\"); }",
  }, {
    code: "a { background: url( \"foo.css\" ); }",
  }, {
    code: "a { background: url(  \"foo.css\"  ); }",
  }, {
    code: "a { cursor: url(\"foo.png\"); }",
  }, {
    code: "a { background-image: url(\"foo.css\"), url(\"bar.css\"), url(\"baz.css\"); }",
  }, {
    code: "a { background-image: url( \"foo.css\" ), url( \"bar.css\" ), url( \"baz.css\" ); }",
  }, {
    code: "@import url('foo.css');",
  }, {
    code: "@import uRl('foo.css');",
  }, {
    code: "@import URL('foo.css');",
  }, {
    code: "@import url( 'foo.css' );",
  }, {
    code: "@document url('http://www.w3.org/');",
  }, {
    code: "@document url( 'http://www.w3.org/' );",
  }, {
    code: "@document url-prefix('http://www.w3.org/');",
  }, {
    code: "@document url-prefix( 'http://www.w3.org/' );",
  }, {
    code: "@document domain('http://www.w3.org/');",
  }, {
    code: "@document domain( 'http://www.w3.org/' );",
  }, {
    code: "@font-face { font-family: 'foo'; src: url('foo.ttf'); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url( 'foo.ttf' ); }",
  }, {
    code: "a { background: url('foo.css'); }",
  }, {
    code: "a { background: uRl('foo.css'); }",
  }, {
    code: "a { background: URL('foo.css'); }",
  }, {
    code: "a { background: url( 'foo.css' ); }",
  }, {
    code: "a { background: url(  'foo.css'  ); }",
  }, {
    code: "a { cursor: url('foo.png'); }",
  }, {
    code: "a { background-image: url('foo.css'), url('bar.css'), url('baz.css'); }",
  }, {
    code: "a { background-image: url( 'foo.css' ), url( 'bar.css' ), url( 'baz.css' ); }",
  } ],

  reject: [ {
    code: "@import url(foo.css);",
    message: messages.expected("quotes"),
    line: 1,
    column: 13,
  }, {
    code: "@import url( foo.css );",
    message: messages.expected("quotes"),
    line: 1,
    column: 14,
  }, {
    code: "@document url-prefix(http://www.w3.org/Style);",
    message: messages.expected("quotes", "url-prefix"),
    line: 1,
    column: 22,
  }, {
    code: "@document url-prefix( http://www.w3.org/Style );",
    message: messages.expected("quotes", "url-prefix"),
    line: 1,
    column: 23,
  }, {
    code: "@font-face { font-family: 'foo'; src: url(foo.ttf); }",
    message: messages.expected("quotes"),
    line: 1,
    column: 43,
  }, {
    code: "@font-face { font-family: 'foo'; src: url( foo.ttf ); }",
    message: messages.expected("quotes"),
    line: 1,
    column: 44,
  }, {
    code: "a { cursor: url(foo.png); }",
    message: messages.expected("quotes"),
    line: 1,
    column: 17,
  }, {
    code: "a { background-image: url(foo.css), url(\"bar.css\"), url(\"baz.css\"); }",
    message: messages.expected("quotes"),
    line: 1,
    column: 27,
  }, {
    code: "a { background-image: url( foo.css ), url(\"bar.css\"), url(\"baz.css\"); }",
    message: messages.expected("quotes"),
    line: 1,
    column: 28,
  }, {
    code: "a { background-image: url(\"foo.css\"), url(bar.css), url(\"baz.css\"); }",
    message: messages.expected("quotes"),
    line: 1,
    column: 43,
  }, {
    code: "a { background-image: url(\"foo.css\"), url( bar.css ), url(\"baz.css\"); }",
    message: messages.expected("quotes"),
    line: 1,
    column: 44,
  }, {
    code: "a { background-image: url(\"foo.css\"), url(\"bar.css\"), url(baz.css); }",
    message: messages.expected("quotes"),
    line: 1,
    column: 59,
  }, {
    code: "a { background-image: url(\"foo.css\"), url(\"bar.css\"), url( baz.css ); }",
    message: messages.expected("quotes"),
    line: 1,
    column: 60,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [ {
    code: "@import url(foo.css);",
  }, {
    code: "@import uRl(foo.css);",
  }, {
    code: "@import URL(foo.css);",
  }, {
    code: "@import url( foo.css );",
  }, {
    code: "@document url(http://www.w3.org/);",
  }, {
    code: "@document url( http://www.w3.org/ );",
  }, {
    code: "@document url-prefix(http://www.w3.org/);",
  }, {
    code: "@document url-prefix( http://www.w3.org/ );",
  }, {
    code: "@document domain(http://www.w3.org/);",
  }, {
    code: "@document domain( http://www.w3.org/ );",
  }, {
    code: "@font-face { font-family: foo; src: url(foo.ttf); }",
  }, {
    code: "@font-face { font-family: foo; src: url( foo.ttf ); }",
  }, {
    code: "a { background: url(foo.css); }",
  }, {
    code: "a { background: uRl(foo.css); }",
  }, {
    code: "a { background: URL(foo.css); }",
  }, {
    code: "a { background: url( foo.css ); }",
  }, {
    code: "a { background: url(  foo.css  ); }",
  }, {
    code: "a { cursor: url(foo.png); }",
  }, {
    code: "a { background-image: url(foo.css), url(bar.css), url(baz.css); }",
  }, {
    code: "a { background-image: url( foo.css ), url( bar.css ), url( baz.css ); }",
  } ],

  reject: [ {
    code: "@import url(\"foo.css\");",
    message: messages.expected("no quotes"),
    line: 1,
    column: 13,
  }, {
    code: "@import uRl(\"foo.css\");",
    message: messages.expected("no quotes"),
    line: 1,
    column: 13,
  }, {
    code: "@import URL(\"foo.css\");",
    message: messages.expected("no quotes"),
    line: 1,
    column: 13,
  }, {
    code: "@import url( \"foo.css\" );",
    message: messages.expected("no quotes"),
    line: 1,
    column: 14,
  }, {
    code: "@import url('foo.css');",
    message: messages.expected("no quotes"),
    line: 1,
    column: 13,
  }, {
    code: "@import url( 'foo.css' );",
    message: messages.expected("no quotes"),
    line: 1,
    column: 14,
  }, {
    code: "@document url(\"http://www.w3.org/\");",
    message: messages.expected("no quotes"),
    line: 1,
    column: 15,
  }, {
    code: "@document url( \"http://www.w3.org/\" );",
    message: messages.expected("no quotes"),
    line: 1,
    column: 16,
  }, {
    code: "@document url-prefix('http://www.w3.org/Style');",
    message: messages.expected("no quotes", "url-prefix"),
    line: 1,
    column: 22,
  }, {
    code: "@document url-prefix( 'http://www.w3.org/Style' );",
    message: messages.expected("no quotes", "url-prefix"),
    line: 1,
    column: 23,
  }, {
    code: "@document domain(\"mozilla.org\");",
    message: messages.expected("no quotes", "domain"),
    line: 1,
    column: 18,
  }, {
    code: "@document domain( \"mozilla.org\" );",
    message: messages.expected("no quotes", "domain"),
    line: 1,
    column: 19,
  }, {
    code: "@font-face { font-family: foo; src: url('foo.ttf'); }",
    message: messages.expected("no quotes"),
    line: 1,
    column: 41,
  }, {
    code: "@font-face { font-family: foo; src: url( 'foo.ttf' ); }",
    message: messages.expected("no quotes"),
    line: 1,
    column: 42,
  }, {
    code: "a { background: url(\"foo.css\"); }",
    message: messages.expected("no quotes"),
    line: 1,
    column: 21,
  }, {
    code: "a { background: uRl(\"foo.css\"); }",
    message: messages.expected("no quotes"),
    line: 1,
    column: 21,
  }, {
    code: "a { background: URL(\"foo.css\"); }",
    message: messages.expected("no quotes"),
    line: 1,
    column: 21,
  }, {
    code: "a { background: url( \"foo.css\" ); }",
    message: messages.expected("no quotes"),
    line: 1,
    column: 22,
  }, {
    code: "a { background: url(  \"foo.css\"  ); }",
    message: messages.expected("no quotes"),
    line: 1,
    column: 23,
  }, {
    code: "a { cursor: url(\"foo.png\"); }",
    message: messages.expected("no quotes"),
    line: 1,
    column: 17,
  }, {
    code: "a { background-image: url('foo.css'), url(bar.css), url(baz.css); }",
    message: messages.expected("no quotes"),
    line: 1,
    column: 27,
  }, {
    code: "a { background-image: url( 'foo.css' ), url(bar.css), url(baz.css); }",
    message: messages.expected("no quotes"),
    line: 1,
    column: 28,
  }, {
    code: "a { background-image: url(foo.css), url('bar.css'), url(baz.css); }",
    message: messages.expected("no quotes"),
    line: 1,
    column: 41,
  }, {
    code: "a { background-image: url(foo.css), url( 'bar.css' ), url(baz.css); }",
    message: messages.expected("no quotes"),
    line: 1,
    column: 42,
  }, {
    code: "a { background-image: url(foo.css), url(bar.css), url('baz.css'); }",
    message: messages.expected("no quotes"),
    line: 1,
    column: 55,
  }, {
    code: "a { background-image: url(foo.css), url(bar.css), url( 'baz.css' ); }",
    message: messages.expected("no quotes"),
    line: 1,
    column: 56,
  } ],
})

test("deprecation warning for single", t => {
  const config = {
    rules: {
      "function-url-quotes": "single",
    },
  }
  let planned = 0

  postcss().use(stylelint(config)).process("@import url(\"foo.css\");").then(result => {
    t.equal(result.warnings().length, 2)
    t.equal(result.warnings()[0].text, "The 'single' option for 'function-url-quotes' has been deprecated, and will be removed in '7.0'. Instead, use the 'always' or 'never' options together with the 'string-quotes' rule.")
    t.equal(result.warnings()[0].stylelintType, "deprecation")
    t.equal(result.warnings()[1].text, "Expected single quotes around url argument (function-url-quotes)")
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

test("deprecation warning for double", t => {
  const config = {
    rules: {
      "function-url-quotes": "double",
    },
  }
  let planned = 0

  postcss().use(stylelint(config)).process("@import url('foo.css');").then(result => {
    t.equal(result.warnings().length, 2)
    t.equal(result.warnings()[0].text, "The 'double' option for 'function-url-quotes' has been deprecated, and will be removed in '7.0'. Instead, use the 'always' or 'never' options together with the 'string-quotes' rule.")
    t.equal(result.warnings()[0].stylelintType, "deprecation")
    t.equal(result.warnings()[1].text, "Expected double quotes around url argument (function-url-quotes)")
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

test("deprecation warning for none", t => {
  const config = {
    rules: {
      "function-url-quotes": "none",
    },
  }
  let planned = 0

  postcss().use(stylelint(config)).process("@import url(\"foo.css\");").then(result => {
    t.equal(result.warnings().length, 2)
    t.equal(result.warnings()[0].text, "The 'none' option for 'function-url-quotes' has been deprecated, and will be removed in '7.0'. Instead, use the 'always' or 'never' options together with the 'string-quotes' rule.")
    t.equal(result.warnings()[0].stylelintType, "deprecation")
    t.equal(result.warnings()[1].text, "Expected no quotes around url argument (function-url-quotes)")
  }).catch(logError)
  planned += 4

  t.plan(planned)
})

function logError(err) {
  console.log(err.stack) // eslint-disable-line no-console
}
