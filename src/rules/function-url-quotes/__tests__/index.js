import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["double"],

  accept: [ {
    code: "@import url(\"foo.css\");",

    description: {
      message: messages.expected("double quotes"),
      line: 1,
      column: 14,
    },
  }, {
    code: "@import uRl(\"foo.css\");",

    description: {
      message: messages.expected("double quotes"),
      line: 1,
      column: 14,
    },
  }, {
    code: "@import URL(\"foo.css\");",

    description: {
      message: messages.expected("double quotes"),
      line: 1,
      column: 14,
    },
  }, {
    code: "@import url( \"foo.css\" );",

    description: {
      message: messages.expected("double quotes"),
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
  } ],

  reject: [ {
    code: "@import url('foo.css');",
    message: messages.expected("double quotes"),
    line: 1,
    column: 13,
  }, {
    code: "@import uRl('foo.css');",
    message: messages.expected("double quotes"),
    line: 1,
    column: 13,
  }, {
    code: "@import uRl('foo.css');",
    message: messages.expected("double quotes"),
    line: 1,
    column: 13,
  }, {
    code: "@import url( 'foo.css' );",
    message: messages.expected("double quotes"),
    line: 1,
    column: 14,
  }, {
    code: "@import url(foo.css);",
    message: messages.expected("double quotes"),
    line: 1,
    column: 13,
  }, {
    code: "@import url( foo.css );",
    message: messages.expected("double quotes"),
    line: 1,
    column: 14,
  }, {
    code: "@document url('http://www.w3.org/');",
    message: messages.expected("double quotes"),
    line: 1,
    column: 15,
  }, {
    code: "@document url( 'http://www.w3.org/' );",
    message: messages.expected("double quotes"),
    line: 1,
    column: 16,
  }, {
    code: "@document url-prefix(http://www.w3.org/Style);",
    message: messages.expected("double quotes", "url-prefix"),
    line: 1,
    column: 22,
  }, {
    code: "@document url-prefix( http://www.w3.org/Style );",
    message: messages.expected("double quotes", "url-prefix"),
    line: 1,
    column: 23,
  }, {
    code: "@document domain('mozilla.org');",
    message: messages.expected("double quotes", "domain"),
    line: 1,
    column: 18,
  }, {
    code: "@document domain( 'mozilla.org' );",
    message: messages.expected("double quotes", "domain"),
    line: 1,
    column: 19,
  }, {
    code: "@font-face { font-family: 'foo'; src: url(foo.ttf); }",
    message: messages.expected("double quotes"),
    line: 1,
    column: 43,
  }, {
    code: "@font-face { font-family: 'foo'; src: url( foo.ttf ); }",
    message: messages.expected("double quotes"),
    line: 1,
    column: 44,
  }, {
    code: "a { background: url('foo.css'); }",
    message: messages.expected("double quotes"),
    line: 1,
    column: 21,
  }, {
    code: "a { background: uRl('foo.css'); }",
    message: messages.expected("double quotes"),
    line: 1,
    column: 21,
  }, {
    code: "a { background: URL('foo.css'); }",
    message: messages.expected("double quotes"),
    line: 1,
    column: 21,
  }, {
    code: "a { background: url( 'foo.css' ); }",
    message: messages.expected("double quotes"),
    line: 1,
    column: 22,
  }, {
    code: "a { background: url(  'foo.css'  ); }",
    message: messages.expected("double quotes"),
    line: 1,
    column: 23,
  }, {
    code: "a { cursor: url(foo.png); }",
    message: messages.expected("double quotes"),
    line: 1,
    column: 17,
  }, {
    code: "a { background-image: url(foo.css), url(\"bar.css\"), url(\"baz.css\"); }",
    message: messages.expected("double quotes"),
    line: 1,
    column: 27,
  }, {
    code: "a { background-image: url( foo.css ), url(\"bar.css\"), url(\"baz.css\"); }",
    message: messages.expected("double quotes"),
    line: 1,
    column: 28,
  }, {
    code: "a { background-image: url(\"foo.css\"), url(bar.css), url(\"baz.css\"); }",
    message: messages.expected("double quotes"),
    line: 1,
    column: 43,
  }, {
    code: "a { background-image: url(\"foo.css\"), url( bar.css ), url(\"baz.css\"); }",
    message: messages.expected("double quotes"),
    line: 1,
    column: 44,
  }, {
    code: "a { background-image: url(\"foo.css\"), url(\"bar.css\"), url(baz.css); }",
    message: messages.expected("double quotes"),
    line: 1,
    column: 59,
  }, {
    code: "a { background-image: url(\"foo.css\"), url(\"bar.css\"), url( baz.css ); }",
    message: messages.expected("double quotes"),
    line: 1,
    column: 60,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["single"],

  accept: [ {
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
    code: "@import url(\"foo.css\");",
    message: messages.expected("single quotes"),
    line: 1,
    column: 13,
  },  {
    code: "@import uRl(\"foo.css\");",
    message: messages.expected("single quotes"),
    line: 1,
    column: 13,
  }, {
    code: "@import URL(\"foo.css\");",
    message: messages.expected("single quotes"),
    line: 1,
    column: 13,
  }, {
    code: "@import url( \"foo.css\" );",
    message: messages.expected("single quotes"),
    line: 1,
    column: 14,
  }, {
    code: "@import url(foo.css);",
    message: messages.expected("single quotes"),
    line: 1,
    column: 13,
  }, {
    code: "@import url( foo.css );",
    message: messages.expected("single quotes"),
    line: 1,
    column: 14,
  }, {
    code: "@document url(\"http://www.w3.org/\");",
    message: messages.expected("single quotes"),
    line: 1,
    column: 15,
  }, {
    code: "@document url( \"http://www.w3.org/\" );",
    message: messages.expected("single quotes"),
    line: 1,
    column: 16,
  }, {
    code: "@document url-prefix(http://www.w3.org/Style);",
    message: messages.expected("single quotes", "url-prefix"),
    line: 1,
    column: 22,
  }, {
    code: "@document url-prefix( http://www.w3.org/Style );",
    message: messages.expected("single quotes", "url-prefix"),
    line: 1,
    column: 23,
  }, {
    code: "@document domain(\"mozilla.org\");",
    message: messages.expected("single quotes", "domain"),
    line: 1,
    column: 18,
  }, {
    code: "@document domain( \"mozilla.org\" );",
    message: messages.expected("single quotes", "domain"),
    line: 1,
    column: 19,
  }, {
    code: "@font-face { font-family: 'foo'; src: url(foo.ttf); }",
    message: messages.expected("single quotes"),
    line: 1,
    column: 43,
  }, {
    code: "@font-face { font-family: 'foo'; src: url( foo.ttf ); }",
    message: messages.expected("single quotes"),
    line: 1,
    column: 44,
  }, {
    code: "a { background: url(\"foo.css\"); }",
    message: messages.expected("single quotes"),
    line: 1,
    column: 21,
  }, {
    code: "a { background: uRl(\"foo.css\"); }",
    message: messages.expected("single quotes"),
    line: 1,
    column: 21,
  }, {
    code: "a { background: URL(\"foo.css\"); }",
    message: messages.expected("single quotes"),
    line: 1,
    column: 21,
  }, {
    code: "a { background: url( \"foo.css\" ); }",
    message: messages.expected("single quotes"),
    line: 1,
    column: 22,
  }, {
    code: "a { background: url(  \"foo.css\"  ); }",
    message: messages.expected("single quotes"),
    line: 1,
    column: 23,
  }, {
    code: "a { cursor: url(foo.png); }",
    message: messages.expected("single quotes"),
    line: 1,
    column: 17,
  }, {
    code: "a { background-image: url(foo.css), url('bar.css'), url('baz.css'); }",
    message: messages.expected("single quotes"),
    line: 1,
    column: 27,
  }, {
    code: "a { background-image: url( foo.css ), url('bar.css'), url('baz.css'); }",
    message: messages.expected("single quotes"),
    line: 1,
    column: 28,
  }, {
    code: "a { background-image: url('foo.css'), url(bar.css), url('baz.css'); }",
    message: messages.expected("single quotes"),
    line: 1,
    column: 43,
  }, {
    code: "a { background-image: url('foo.css'), url( bar.css ), url('baz.css'); }",
    message: messages.expected("single quotes"),
    line: 1,
    column: 44,
  }, {
    code: "a { background-image: url('foo.css'), url('bar.css'), url(baz.css); }",
    message: messages.expected("single quotes"),
    line: 1,
    column: 59,
  }, {
    code: "a { background-image: url('foo.css'), url('bar.css'), url( baz.css ); }",
    message: messages.expected("single quotes"),
    line: 1,
    column: 60,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["none"],

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
