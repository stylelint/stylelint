import { testRule } from "../../../testUtils"

import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [ {
    code: "@import url(x.com?a=b,c=d)",
  }, {
    code: "@media (max-width: 600px) {}",
  }, {
    code: "@media screen and (color), projection and (color) {}",
  }, {
    code: "@media screen and (color) , projection and (color) {}",
  }, {
    code: "@media screen and (color)\n, projection and (color) {}",
  }, {
    code: "@media screen and (color)\r\n, projection and (color) {}",
    description: "CRLF",
  } ],

  reject: [ {
    code: "@media screen and (color),projection and (color)",
    message: messages.expectedAfter(),
    line: 1,
    column: 26,
  }, {
    code: "@media screen and (color),  projection and (color)",
    message: messages.expectedAfter(),
    line: 1,
    column: 26,
  }, {
    code: "@media screen and (color),\nprojection and (color)",
    message: messages.expectedAfter(),
    line: 1,
    column: 26,
  }, {
    code: "@media screen and (color),\r\nprojection and (color)",
    description: "CRLF",
    message: messages.expectedAfter(),
    line: 1,
    column: 26,
  }, {
    code: "@media screen and (color),\tprojection and (color)",
    message: messages.expectedAfter(),
    line: 1,
    column: 26,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [ {
    code: "@import url(x.com?a=b, c=d)",
  }, {
    code: "@media (max-width: 600px) {}",
  }, {
    code: "@media screen and (color),projection and (color) {}",
  }, {
    code: "@media screen and (color) ,projection and (color) {}",
  }, {
    code: "@media screen and (color)\n,projection and (color) {}",
  }, {
    code: "@media screen and (color)\r\n,projection and (color) {}",
    description: "CRLF",
  } ],

  reject: [ {
    code: "@media screen and (color), projection and (color)",
    message: messages.rejectedAfter(),
    line: 1,
    column: 26,
  }, {
    code: "@media screen and (color),  projection and (color)",
    message: messages.rejectedAfter(),
    line: 1,
    column: 26,
  }, {
    code: "@media screen and (color),\nprojection and (color)",
    message: messages.rejectedAfter(),
    line: 1,
    column: 26,
  }, {
    code: "@media screen and (color),\r\nprojection and (color)",
    description: "CRLF",
    message: messages.rejectedAfter(),
    line: 1,
    column: 26,
  }, {
    code: "@media screen and (color),\tprojection and (color)",
    message: messages.rejectedAfter(),
    line: 1,
    column: 26,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

  accept: [ {
    code: "@media screen and (color), projection and (color) {}",
  }, {
    code: "@media screen and (color), projection and (color) {\n}",
    description: "single-line list, multi-line block",
  }, {
    code: "@media screen and (color), projection and (color) {\r\n}",
    description: "single-line list, multi-line block and CRLF",
  }, {
    code: "@media screen and (color)\n,projection and (color) {}",
    description: "ignore multi-line",
  }, {
    code: "@media screen and (color)\r\n,projection and (color) {}",
    description: "ignore multi-line and CRLF",
  } ],

  reject: [ {
    code: "@media screen and (color) ,projection and (color) {}",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 27,
  }, {
    code: "@media screen and (color) ,projection and (color) {\n}",
    description: "single-line list, multi-line block",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 27,
  }, {
    code: "@media screen and (color) ,projection and (color) {\r\n}",
    description: "single-line list, multi-line block and CRLF",
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 27,
  } ],
})

testRule(rule, {
  ruleName,
  config: ["never-single-line"],

  accept: [ {
    code: "@media screen and (color) ,projection and (color) {}",
  }, {
    code: "@media screen and (color) ,projection and (color) {\n}",
    description: "single-line list, multi-line block",
  }, {
    code: "@media screen and (color) ,projection and (color) {\r\n}",
    description: "single-line list, multi-line block and CRLF",
  }, {
    code: "@media screen and (color),\nprojection and (color) {}",
    description: "ignore multi-line",
  }, {
    code: "@media screen and (color),\r\nprojection and (color) {}",
    description: "ignore multi-line and CRLF",
  } ],

  reject: [ {
    code: "@media screen and (color), projection and (color) {}",
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 26,
  }, {
    code: "@media screen and (color), projection and (color) {\n}",
    description: "single-line list, multi-line block",
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 26,
  }, {
    code: "@media screen and (color), projection and (color) {\r\n}",
    description: "single-line list, multi-line block and CRLF",
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 26,
  } ],
})
