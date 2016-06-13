import { testRule } from "../../../testUtils"
import rules from "../../../rules"
import { ruleName, messages } from ".."

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "@import url(\"foo.css\");",

    description: {
      message: messages.expected(),
      line: 1,
      column: 14,
    },
  }, {
    code: "@import uRl(\"foo.css\");",

    description: {
      message: messages.expected(),
      line: 1,
      column: 14,
    },
  }, {
    code: "@import URL(\"foo.css\");",

    description: {
      message: messages.expected(),
      line: 1,
      column: 14,
    },
  }, {
    code: "@import url( \"foo.css\" );",

    description: {
      message: messages.expected(),
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
  }, {
    code: "@import url(@variable);",
  }, {
    code: "@import url($variable + 'foo.css');",
  }, {
    code: "@import url($variable + \"foo.css\");",
  }, {
    code: "@import url('foo.css' + $variable);",
  }, {
    code: "@import url(\"foo.css\" + $variable);",
  }, {
    code: "@import url($variable-one + 'foo.css' + $variable-two);",
  }, {
    code: "@import url($variable-one + \"foo.css\" + $variable-two);",
  }, {
    code: "@font-face { font-family: 'foo'; src: url(@variable); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url($variable + 'foo.ttf'); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url($variable + \"foo.ttf\"); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url(\"foo.ttf\" + $variable); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url('foo.ttf' + $variable); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url($variable + 'foo.ttf' + $variable); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url($variable + \"foo.ttf\" + $variable); }",
  }, {
    code: "a { background: url(\"/images/my_image@2x.png\") }",
  } ],

  reject: [ {
    code: "@import url(foo.css);",
    message: messages.expected(),
    line: 1,
    column: 13,
  }, {
    code: "@import url( foo.css );",
    message: messages.expected(),
    line: 1,
    column: 14,
  }, {
    code: "@document url-prefix(http://www.w3.org/Style);",
    message: messages.expected("url-prefix"),
    line: 1,
    column: 22,
  }, {
    code: "@document url-prefix( http://www.w3.org/Style );",
    message: messages.expected("url-prefix"),
    line: 1,
    column: 23,
  }, {
    code: "@font-face { font-family: 'foo'; src: url(foo.ttf); }",
    message: messages.expected(),
    line: 1,
    column: 43,
  }, {
    code: "@font-face { font-family: 'foo'; src: url( foo.ttf ); }",
    message: messages.expected(),
    line: 1,
    column: 44,
  }, {
    code: "a { cursor: url(foo.png); }",
    message: messages.expected(),
    line: 1,
    column: 17,
  }, {
    code: "a { background-image: url(foo.css), url(\"bar.css\"), url(\"baz.css\"); }",
    message: messages.expected(),
    line: 1,
    column: 27,
  }, {
    code: "a { background-image: url( foo.css ), url(\"bar.css\"), url(\"baz.css\"); }",
    message: messages.expected(),
    line: 1,
    column: 28,
  }, {
    code: "a { background-image: url(\"foo.css\"), url(bar.css), url(\"baz.css\"); }",
    message: messages.expected(),
    line: 1,
    column: 43,
  }, {
    code: "a { background-image: url(\"foo.css\"), url( bar.css ), url(\"baz.css\"); }",
    message: messages.expected(),
    line: 1,
    column: 44,
  }, {
    code: "a { background-image: url(\"foo.css\"), url(\"bar.css\"), url(baz.css); }",
    message: messages.expected(),
    line: 1,
    column: 59,
  }, {
    code: "a { background-image: url(\"foo.css\"), url(\"bar.css\"), url( baz.css ); }",
    message: messages.expected(),
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
  }, {
    code: "@import url(@variable);",
  }, {
    code: "@import url($variable + 'foo.css');",
  }, {
    code: "@import url($variable + \"foo.css\");",
  }, {
    code: "@import url('foo.css' + $variable);",
  }, {
    code: "@import url(\"foo.css\" + $variable);",
  }, {
    code: "@import url($variable-one + 'foo.css' + $variable-two);",
  }, {
    code: "@import url($variable-one + \"foo.css\" + $variable-two);",
  }, {
    code: "@font-face { font-family: 'foo'; src: url(@variable); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url($variable + 'foo.ttf'); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url($variable + \"foo.ttf\"); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url(\"foo.ttf\" + $variable); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url('foo.ttf' + $variable); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url($variable + 'foo.ttf' + $variable); }",
  }, {
    code: "@font-face { font-family: 'foo'; src: url($variable + \"foo.ttf\" + $variable); }",
  } ],

  reject: [ {
    code: "@import url(\"foo.css\");",
    message: messages.rejected(),
    line: 1,
    column: 13,
  }, {
    code: "@import uRl(\"foo.css\");",
    message: messages.rejected(),
    line: 1,
    column: 13,
  }, {
    code: "@import URL(\"foo.css\");",
    message: messages.rejected(),
    line: 1,
    column: 13,
  }, {
    code: "@import url( \"foo.css\" );",
    message: messages.rejected(),
    line: 1,
    column: 14,
  }, {
    code: "@import url('foo.css');",
    message: messages.rejected(),
    line: 1,
    column: 13,
  }, {
    code: "@import url( 'foo.css' );",
    message: messages.rejected(),
    line: 1,
    column: 14,
  }, {
    code: "@document url(\"http://www.w3.org/\");",
    message: messages.rejected(),
    line: 1,
    column: 15,
  }, {
    code: "@document url( \"http://www.w3.org/\" );",
    message: messages.rejected(),
    line: 1,
    column: 16,
  }, {
    code: "@document url-prefix('http://www.w3.org/Style');",
    message: messages.rejected("url-prefix"),
    line: 1,
    column: 22,
  }, {
    code: "@document url-prefix( 'http://www.w3.org/Style' );",
    message: messages.rejected("url-prefix"),
    line: 1,
    column: 23,
  }, {
    code: "@document domain(\"mozilla.org\");",
    message: messages.rejected("domain"),
    line: 1,
    column: 18,
  }, {
    code: "@document domain( \"mozilla.org\" );",
    message: messages.rejected("domain"),
    line: 1,
    column: 19,
  }, {
    code: "@font-face { font-family: foo; src: url('foo.ttf'); }",
    message: messages.rejected(),
    line: 1,
    column: 41,
  }, {
    code: "@font-face { font-family: foo; src: url( 'foo.ttf' ); }",
    message: messages.rejected(),
    line: 1,
    column: 42,
  }, {
    code: "a { background: url(\"foo.css\"); }",
    message: messages.rejected(),
    line: 1,
    column: 21,
  }, {
    code: "a { background: uRl(\"foo.css\"); }",
    message: messages.rejected(),
    line: 1,
    column: 21,
  }, {
    code: "a { background: URL(\"foo.css\"); }",
    message: messages.rejected(),
    line: 1,
    column: 21,
  }, {
    code: "a { background: url( \"foo.css\" ); }",
    message: messages.rejected(),
    line: 1,
    column: 22,
  }, {
    code: "a { background: url(  \"foo.css\"  ); }",
    message: messages.rejected(),
    line: 1,
    column: 23,
  }, {
    code: "a { cursor: url(\"foo.png\"); }",
    message: messages.rejected(),
    line: 1,
    column: 17,
  }, {
    code: "a { background-image: url('foo.css'), url(bar.css), url(baz.css); }",
    message: messages.rejected(),
    line: 1,
    column: 27,
  }, {
    code: "a { background-image: url( 'foo.css' ), url(bar.css), url(baz.css); }",
    message: messages.rejected(),
    line: 1,
    column: 28,
  }, {
    code: "a { background-image: url(foo.css), url('bar.css'), url(baz.css); }",
    message: messages.rejected(),
    line: 1,
    column: 41,
  }, {
    code: "a { background-image: url(foo.css), url( 'bar.css' ), url(baz.css); }",
    message: messages.rejected(),
    line: 1,
    column: 42,
  }, {
    code: "a { background-image: url(foo.css), url(bar.css), url('baz.css'); }",
    message: messages.rejected(),
    line: 1,
    column: 55,
  }, {
    code: "a { background-image: url(foo.css), url(bar.css), url( 'baz.css' ); }",
    message: messages.rejected(),
    line: 1,
    column: 56,
  }, {
    code: "a { background: url(\"/images/my_image@2x.png\") }",
    message: messages.rejected(),
    line: 1,
    column: 21,
  } ],
})
