/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [{
    code: "a::before { content: \"func(foo,bar,baz)\"; }",
  }, {
    code: "a::before { background: url('func(foo,bar,baz)'); }",
  }, {
    code: "a { background-size: 0,0,0; }",
  }, {
    code: "a { transform: translate(1 , 1); }",
  }, {
    code: "a { transform: translate(1, 1); }",
  }, {
    code: "a { transform: color(rgb(0 , 0, 0) lightness(50%)); }",
  }, {
    code: "a { background: url(data:image/svg+xml;charset=utf8,%3Csvg%20xmlns); }",
    description: "data URI with spaceless comma",
  }],

  reject: [{
    code: "a { transform: translate(1,1); }",
    message: messages.expectedAfter(),
    line: 1,
    column: 27,
  }, {
    code: "a { transform: translate(1,  1); }",
    message: messages.expectedAfter(),
    line: 1,
    column: 27,
  }, {
    code: "a { transform: translate(1,\n1); }",
    message: messages.expectedAfter(),
    line: 1,
    column: 27,
  }, {
    code: "a { transform: translate(1,\r\n1); }",
    description: "CRLF",
    message: messages.expectedAfter(),
    line: 1,
    column: 27,
  }, {
    code: "a { transform: translate(1,\t1); }",
    message: messages.expectedAfter(),
    line: 1,
    column: 27,
  }, {
    code: "a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }",
    message: messages.expectedAfter(),
    line: 1,
    column: 32,
  }, {
    code: "a { transform: color(lightness(50%) rgb(0 , 0 ,0)); }",
    message: messages.expectedAfter(),
    line: 1,
    column: 47,
  }],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [{
    code: "a::before { content: \"func(foo, bar, baz)\"; }",
  }, {
    code: "a::before { background: url('func(foo, bar, baz)'); }",
  }, {
    code: "a { background-size: 0, 0, 0; }",
  }, {
    code: "a { transform: translate(1 ,1); }",
  }, {
    code: "a { transform: translate(1,1); }",
  }, {
    code: "a { transform: color(rgb(0 ,0,0) lightness(50%)); }",
  }],

  reject: [{
    code: "a { transform: translate(1, 1); }",
    message: messages.rejectedAfter(),
    line: 1,
    column: 27,
  }, {
    code: "a { transform: translate(1,  1); }",
    message: messages.rejectedAfter(),
    line: 1,
    column: 27,
  }, {
    code: "a { transform: translate(1,\n1); }",
    message: messages.rejectedAfter(),
    line: 1,
    column: 27,
  }, {
    code: "a { transform: translate(1,\r\n1); }",
    description: "CRLF",
    message: messages.rejectedAfter(),
    line: 1,
    column: 27,
  }, {
    code: "a { transform: translate(1,\t1); }",
    message: messages.rejectedAfter(),
    line: 1,
    column: 27,
  }, {
    code: "a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }",
    message: messages.rejectedAfter(),
    line: 1,
    column: 28,
  }, {
    code: "a { transform: lightness(50%) color(rgb(0 , 0 ,0) ); }",
    message: messages.rejectedAfter(),
    line: 1,
    column: 43,
  }],
})

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

  accept: [{
    code: "a::before { content: \"func(foo,bar,baz)\"; }",
  }, {
    code: "a::before { background: url('func(foo,bar,baz)'); }",
  }, {
    code: "a { background-size: 0,0,0; }",
  }, {
    code: "a { transform: translate(1 , 1); }",
  }, {
    code: "a { transform: translate(1, 1); }",
  }, {
    code: "a { transform: color(rgb(0 , 0, 0) lightness(50%)); }",
  }, {
    code: "a { transform: translate(1,\n1); }",
  }, {
    code: "a { transform: translate(1\n,1); }",
  }, {
    code: "a { transform: translate(1,\r\n1); }",
    description: "CRLF",
  }, {
    code: "a { color: rgba(0,0\n,0); }",
    description: "CRLF",
  }, {
    code: "a { color: rgba(0\n,0,0); }",
    description: "CRLF",
  }, {
    code: "a { background: linear-gradient(45deg\n,rgba(0, 0, 0, 1)\n,red); }",
  }],

  reject: [{
    code: "a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 32,
  }, {
    code: "a { transform: color(lightness(50%) rgb(0 , 0 ,0)); }",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 47,
  }, {
    code: "a { background: linear-gradient(45deg\n,rgba(0, 0,0, 1),red); }",
    message: messages.expectedAfterSingleLine(),
    line: 2,
    column: 11,
  }],
})

testRule(rule, {
  ruleName,
  config: ["never-single-line"],

  accept: [{
    code: "a::before { content: \"func(foo, bar, baz)\"; }",
  }, {
    code: "a::before { background: url('func(foo, bar, baz)'); }",
  }, {
    code: "a { background-size: 0, 0, 0; }",
  }, {
    code: "a { transform: translate(1 ,1); }",
  }, {
    code: "a { transform: translate(1,1); }",
  }, {
    code: "a { transform: color(rgb(0 ,0,0) lightness(50%)); }",
  }, {
    code: "a { transform: translate(1,\n1); }",
  }, {
    code: "a { transform: translate(1\n, 1); }",
  }, {
    code: "a { transform: translate(1\r\n, 1); }",
    description: "CRLF",
  }, {
    code: "a { color: rgba(0, 0\n, 0); }",
    description: "CRLF",
  }, {
    code: "a { color: rgba(0\n, 0, 0); }",
    description: "CRLF",
  }],

  reject: [{
    code: "a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }",
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 28,
  }, {
    code: "a { transform: lightness(50%) color(rgb(0 , 0 ,0) ); }",
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 43,
  }, {
    code: "a { transform: lightness(50%)\ncolor(rgb(0 , 0 ,0) ); }",
    message: messages.rejectedAfterSingleLine(),
    line: 2,
    column: 13,
  }],
})