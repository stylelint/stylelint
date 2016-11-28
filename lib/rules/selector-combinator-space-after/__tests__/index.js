"use strict"

const messages = require("..").messages
const ruleName = require("..").ruleName
const rules = require("../../../rules")
const testRule = require("../../../testUtils/testRule")

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "a + a {}",
    description: "space before and after + combinator",
  }, {
    code: "a > a {}",
    description: "space before and after > combinator",
  }, {
    code: "a ~ a {}",
    description: "space before and after ~ combinator",
  }, {
    code: ".foo ~ a + bar {}",
    description: "multiple spaced combinators",
  }, {
    code: "a+ a {}",
    description: "no before and one after + combinator",
  }, {
    code: "a> a {}",
    description: "no before and one after > combinator",
  }, {
    code: "a~ a {}",
    description: "no before and one after ~ combinator",
  }, {
    code: "a\n+ a {}",
    description: "newline before space after + combinator",
  }, {
    code: "a\n> a {}",
    description: "newline before space after > combinator",
  }, {
    code: "a\r\n> a {}",
    description: "CRLF before space after > combinator",
  }, {
    code: "a\n~ a {}",
    description: "newline before space after ~ combinator",
  }, {
    code: ".foo~ a+ bar {}",
    description: "multiple combinators with no space before and one after",
  }, {
    code: ".foo:nth-child(2n+1) {}",
    description: "unspaced + in nth-child argument",
  }, {
    code: ".foo:nth-child(2n-1) {}",
    description: "unspaced - in nth-child argument",
  }, {
    code: "a[rel~='copyright'] {}",
    description: "attribute selector with ~=",
  }, {
    code: ".foo\\+bar {}",
    description: "escaped combinator-like character",
  } ],

  reject: [ {
    code: "a+  a {}",
    description: "two spaces after + combinator",
    message: messages.expectedAfter("+"),
  }, {
    code: "a+\na {}",
    description: "newline after + combinator",
    message: messages.expectedAfter("+"),
    line: 1,
    column: 2,
  }, {
    code: "a+a {}",
    description: "no space after + combinator",
    message: messages.expectedAfter("+"),
    line: 1,
    column: 2,
  }, {
    code: "a>a {}",
    description: "no space after > combinator",
    message: messages.expectedAfter(">"),
    line: 1,
    column: 2,
  }, {
    code: "a~a {}",
    description: "no space after ~ combinator",
    message: messages.expectedAfter("~"),
    line: 1,
    column: 2,
  }, {
    code: "a + .foo.bar ~a {}",
    description: "multiple combinators: no space after ~ combinator",
    message: messages.expectedAfter("~"),
    line: 1,
    column: 14,
  }, {
    code: "#foo +.foo.bar ~ a {}",
    description: "multiple combinators: no space after + combinator",
    message: messages.expectedAfter("+"),
    line: 1,
    column: 6,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [ {
    code: "a +a {}",
    description: "space before none after + combinator",
  }, {
    code: "a >a {}",
    description: "space before none after > combinator",
  }, {
    code: "a ~a {}",
    description: "space before none after ~ combinator",
  }, {
    code: ".foo ~a +bar {}",
    description: "multiple combinators with no space after",
  }, {
    code: "a+a {}",
    description: "no space before or after + combinator",
  }, {
    code: "a>a {}",
    description: "no space before or after > combinator",
  }, {
    code: "a~a {}",
    description: "no space before or after ~ combinator",
  }, {
    code: "a\n+a {}",
    description: "newline before and no space after + combinator",
  }, {
    code: "a\r\n+a {}",
    description: "CRLF before and no space after + combinator",
  }, {
    code: "a\n>a {}",
    description: "newline before and no space after > combinator",
  }, {
    code: "a\n~a {}",
    description: "newline before and no space after ~ combinator",
  }, {
    code: "a\r\n~a {}",
    description: "CRLF before and no space after ~ combinator",
  }, {
    code: ".foo:nth-child(2n + 1) {}",
    description: "spaced + in nth-child argument",
  }, {
    code: ".foo:nth-child(2n - 1) {}",
    description: "spaced - in nth-child argument",
  }, {
    code: "a[rel~='copyright'] {}",
    description: "attribute selector with ~=",
  } ],

  reject: [ {
    code: "a+ a {}",
    description: "space after + combinator",
    message: messages.rejectedAfter("+"),
    line: 1,
    column: 2,
  }, {
    code: "a> a {}",
    description: "space after > combinator",
    message: messages.rejectedAfter(">"),
    line: 1,
    column: 2,
  }, {
    code: "a~ a {}",
    description: "space after ~ combinator",
    message: messages.rejectedAfter("~"),
    line: 1,
    column: 2,
  }, {
    code: "a+\na{}",
    description: "newline after + combinator",
    message: messages.rejectedAfter("+"),
    line: 1,
    column: 2,
  }, {
    code: "a+\r\na{}",
    description: "CRLF after + combinator",
    message: messages.rejectedAfter("+"),
    line: 1,
    column: 2,
  }, {
    code: "a>\na{}",
    description: "newline after > combinator",
    message: messages.rejectedAfter(">"),
    line: 1,
    column: 2,
  }, {
    code: "a~\na{}",
    description: "newline after ~ combinator",
    message: messages.rejectedAfter("~"),
    line: 1,
    column: 2,
  }, {
    code: "a~\r\na{}",
    description: "CRLF after ~ combinator",
    message: messages.rejectedAfter("~"),
    line: 1,
    column: 2,
  }, {
    code: "a + .foo.bar ~a {}",
    description: "multiple combinators: space after + combinator",
    message: messages.rejectedAfter("+"),
    line: 1,
    column: 3,
  }, {
    code: "#foo +.foo.bar ~ a {}",
    description: "multiple combinators: no space after ~ combinator",
    message: messages.rejectedAfter("~"),
    line: 1,
    column: 16,
  } ],
})

testRule(rule, {
  ruleName,
  syntax: "less",
  config: ["always"],

  accept: [{
    code: ".a when (@size>=60) and (@size<102) {}",
    description: "ignore constructs",
  }],

  reject: [{
    code: "a+  a {}",
    description: "two spaces after + combinator",
    message: messages.expectedAfter("+"),
  }],
})
