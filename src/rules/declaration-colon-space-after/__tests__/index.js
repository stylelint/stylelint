import testRule from "../../../testUtils/testRule"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "a { color: pink }",
    description: "space only after",
  }, {
    code: "a { color : pink }",
    description: "space before and after",
  }, {
    code: "a { color\n: pink }",
    description: "newline before and space after",
  }, {
    code: "a { color\r\n: pink }",
    description: "CRLF before and space after",
  }, {
    code: "$map:(key:value)",
    description: "SCSS map with no newlines",
  }, {
    code: "$list:('value1', 'value2')",
    description: "SCSS lst with no newlines",
  }, {
    code: "a { background: url(data:application/font-woff;...); }",
    description: "data URI",
  } ],

  reject: [ {
    code: "a { color :pink; }",
    description: "no space after",
    message: messages.expectedAfter(),
    line: 1,
    column: 11,
  }, {
    code: "a { color :  pink; }",
    description: "two spaces after",
    message: messages.expectedAfter(),
    line: 1,
    column: 11,
  }, {
    code: "a { color :\tpink; }",
    description: "tab after",
    message: messages.expectedAfter(),
    line: 1,
    column: 11,
  }, {
    code: "a { color :\npink; }",
    description: "newline after",
    message: messages.expectedAfter(),
    line: 1,
    column: 11,
  }, {
    code: "a { color :\r\npink; }",
    description: "CRLF after",
    message: messages.expectedAfter(),
    line: 1,
    column: 11,
  }, {
    code: "a { color:pink; }",
    description: "no space after",
    message: messages.expectedAfter(),
    line: 1,
    column: 11,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [ {
    code: "a { color:pink }",
    description: "no space before and after",
  }, {
    code: "a { color :pink }",
    description: "space before and no space after",
  }, {
    code: "a { color\n:pink }",
    description: "newline before and no space after",
  }, {
    code: "a { color\r\n:pink }",
    description: "CRLF before and no space after",
  }, {
    code: "$map: (key: value)",
    description: "SCSS map with no newlines",
  } ],

  reject: [ {
    code: "a { color : pink; }",
    description: "space after",
    message: messages.rejectedAfter(),
    line: 1,
    column: 11,
  }, {
    code: "a { color:  pink; }",
    description: "two spaces after",
    message: messages.rejectedAfter(),
    line: 1,
    column: 11,
  }, {
    code: "a { color :\tpink; }",
    description: "tab after",
    message: messages.rejectedAfter(),
    line: 1,
    column: 11,
  }, {
    code: "a { color :\npink; }",
    description: "newline after",
    message: messages.rejectedAfter(),
    line: 1,
    column: 11,
  }, {
    code: "a { color :\r\npink; }",
    description: "CRLF after",
    message: messages.rejectedAfter(),
    line: 1,
    column: 11,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

  accept: [ {
    code: "a { color: pink }",
    description: "space only after single-line",
  }, {
    code: "a { transition: color 1s,\n\twidth 2s; }",
    description: "space after mult-line",
  }, {
    code: "a { transition:color 1s,\n\twidth 2s; }",
    description: "no space after mult-line",
  }, {
    code: "a { transition:color 1s,\r\n\twidth 2s; }",
    description: "no space after mult-line CRLF",
  }, {
    code: "a { transition:\tcolor 1s,\n\twidth 2s; }",
    description: "tab after mult-line",
  } ],

  reject: [ {
    code: "a { color :pink; }",
    description: "no space after single-line",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 11,
  }, {
    code: "a { color :  pink; }",
    description: "two spaces after single-line",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 11,
  }, {
    code: "a { color :\tpink; }",
    description: "tab after single-line",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 11,
  }, {
    code: "a { color :\npink; }",
    description: "newline after single-line",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 11,
  }, {
    code: "a { color :\r\npink; }",
    description: "CRLF after single-line",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 11,
  }, {
    code: "a { color:pink; }",
    description: "no space after",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 11,
  } ],
})
