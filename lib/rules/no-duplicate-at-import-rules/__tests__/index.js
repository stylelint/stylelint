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
      code: '@import "a.css";'
    },
    {
      code: "@import url('a.css');"
    },
    {
      code: "@import url(a.css);"
    },
    {
      code: '@import url("a.css") projection, tv;'
    },
    {
      code: "@import 'a.css'; @import 'b.css';"
    },
    {
      code: "@import url('a.css') projection; @import url('a.css') tv;"
    }
  ],

  reject: [
    {
      code: "@import 'a.css'; @import 'a.css';",
      message: messages.rejected(`a.css`),
      line: 1,
      column: 18
    },
    {
      code: '@import url("a.css"); @import url("a.css");',
      message: messages.rejected(`a.css`),
      line: 1,
      column: 23
    },
    {
      code: "@import \"a.css\";\n@import 'a.css';",
      message: messages.rejected(`a.css`),
      line: 2,
      column: 1
    },
    {
      code: "@import \"a.css\"; @import 'b.css'; @import url(a.css);",
      message: messages.rejected(`a.css`),
      line: 1,
      column: 35
    },
    {
      code: "@import url('a.css') tv; @import 'a.css' tv;",
      message: messages.rejected(`a.css`),
      line: 1,
      column: 26
    },
    {
      code:
        "@import url('a.css') tv, projection; @import 'a.css' projection, tv;",
      message: messages.rejected(`a.css`),
      line: 1,
      column: 38
    },
    {
      code:
        "@import url('a.css') tv, projection; @import 'a.css' projection, screen, tv;",
      message: messages.rejected(`a.css`),
      line: 1,
      column: 38
    }
  ]
});
