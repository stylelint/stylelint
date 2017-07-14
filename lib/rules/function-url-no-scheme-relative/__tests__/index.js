"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: "a { background: url(); }"
    },
    {
      code: "a { background: url(''); }"
    },
    {
      code: 'a { background: url(""); }'
    },
    {
      code: "a { background: url(/); }"
    },
    {
      code: "a { background: url(./); }"
    },
    {
      code: "a { background: url(./file.jpg); }"
    },
    {
      code: "a { background: url(../file.jpg); }"
    },
    {
      code: "a { background: URL(../file.jpg); }"
    },
    {
      code: "a { background: url('../file.jpg'); }"
    },
    {
      code: 'a { background: url("../file.jpg"); }'
    },
    {
      code: "a { background: url('/path/to/file.jpg'); }"
    },
    {
      code: "a { background: url('https://www.google.com/file.jpg'); }"
    },
    {
      code: "a { background: url('http://www.google.com/file.jpg'); }"
    },
    {
      code:
        "a { background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='); }"
    },
    {
      code: "@font-face { font-family: 'foo'; src: url('/path/to/foo.ttf'); }"
    },
    {
      code: "a { background: some-url(); }",
      description: "ignore contain url function"
    },
    {
      code: "a { background: url($image); }",
      description: "ignore variable"
    },
    {
      code: "a { background: url(@image); }",
      description: "ignore variable"
    },
    {
      code: "a { background: url(var(--image)); }",
      description: "ignore variable"
    }
  ],

  reject: [
    {
      code: "a { background: url(//); }",
      message: messages.rejected,
      line: 1,
      column: 21
    },
    {
      code: "a { background: url(//www.google.com/file.jpg); }",
      message: messages.rejected,
      line: 1,
      column: 21
    },
    {
      code: "a { background: url('//www.google.com/file.jpg'); }",
      message: messages.rejected,
      line: 1,
      column: 21
    },
    {
      code: 'a { background: url("//www.google.com/file.jpg"); }',
      message: messages.rejected,
      line: 1,
      column: 21
    },
    {
      code: 'a { background: url( "//www.google.com/file.jpg" ); }',
      message: messages.rejected,
      line: 1,
      column: 21
    },
    {
      code:
        "@font-face { font-family: 'foo'; src: url('//www.google.com/file.jpg'); }",
      message: messages.rejected,
      line: 1,
      column: 43
    },
    {
      code:
        "a { background: no-repeat center/80% url('//www.google.com/file.jpg'); }",
      message: messages.rejected,
      line: 1,
      column: 42
    }
  ]
});
