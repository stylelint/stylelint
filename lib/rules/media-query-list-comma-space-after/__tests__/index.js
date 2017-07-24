"use strict";

const messages = require("..").messages;
const ruleName = require("..").ruleName;
const rules = require("../../../rules");

const rule = rules[ruleName];

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [
    {
      code: "@import url(x.com?a=b,c=d)"
    },
    {
      code: "@media (max-width: 600px) {}"
    },
    {
      code: "@mEdIa (max-width: 600px) {}"
    },
    {
      code: "@MEDIA (max-width: 600px) {}"
    },
    {
      code: "@media screen and (color), projection and (color) {}"
    },
    {
      code: "@media screen and (color) , projection and (color) {}"
    },
    {
      code: "@media screen and (color)\n, projection and (color) {}"
    },
    {
      code: "@media screen and (color)\r\n, projection and (color) {}",
      description: "CRLF"
    },
    {
      code: "@non-media screen and (color),projection and (color) {}",
      description: "ignore at-rules contain media in name"
    },
    {
      code: "@media-non screen and (color),projection and (color) {}",
      description: "ignore at-rules contain media in name"
    }
  ],

  reject: [
    {
      code: "@media screen and (color),projection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@mEdIa screen and (color),projection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@MEDIA screen and (color),projection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),  projection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),\nprojection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),\r\nprojection and (color) {}",
      description: "CRLF",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),\tprojection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "@import url(x.com?a=b, c=d)"
    },
    {
      code: "@media (max-width: 600px) {}"
    },
    {
      code: "@mEdIa (max-width: 600px) {}"
    },
    {
      code: "@MEDIA (max-width: 600px) {}"
    },
    {
      code: "@media screen and (color),projection and (color) {}"
    },
    {
      code: "@media screen and (color) ,projection and (color) {}"
    },
    {
      code: "@media screen and (color)\n,projection and (color) {}"
    },
    {
      code: "@media screen and (color)\r\n,projection and (color) {}",
      description: "CRLF"
    },
    {
      code: "@non-media screen and (color), projection and (color) {}",
      description: "ignore at-rules contain media in name"
    },
    {
      code: "@media-non screen and (color), projection and (color) {}",
      description: "ignore at-rules contain media in name"
    }
  ],

  reject: [
    {
      code: "@media screen and (color), projection and (color) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@mEdIa screen and (color), projection and (color) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@MEDIA screen and (color), projection and (color) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),  projection and (color) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),\nprojection and (color) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),\r\nprojection and (color) {}",
      description: "CRLF",
      message: messages.rejectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),\tprojection and (color) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 26
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

  accept: [
    {
      code: "@media screen and (color), projection and (color) {}"
    },
    {
      code: "@mEdIa screen and (color), projection and (color) {}"
    },
    {
      code: "@MEDIA screen and (color), projection and (color) {}"
    },
    {
      code: "@media screen and (color), projection and (color) {\n}",
      description: "single-line list, multi-line block"
    },
    {
      code: "@media screen and (color), projection and (color) {\r\n}",
      description: "single-line list, multi-line block and CRLF"
    },
    {
      code: "@media screen and (color)\n,projection and (color) {}",
      description: "ignore multi-line"
    },
    {
      code: "@media screen and (color)\r\n,projection and (color) {}",
      description: "ignore multi-line and CRLF"
    },
    {
      code: "@non-media screen and (color) ,projection and (color) {}",
      description: "ignore at-rules contain media in name"
    },
    {
      code: "@media-non screen and (color) ,projection and (color) {}",
      description: "ignore at-rules contain media in name"
    }
  ],

  reject: [
    {
      code: "@media screen and (color) ,projection and (color) {}",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 27
    },
    {
      code: "@mEdIa screen and (color) ,projection and (color) {}",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 27
    },
    {
      code: "@MEDIA screen and (color) ,projection and (color) {}",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 27
    },
    {
      code: "@media screen and (color) ,projection and (color) {\n}",
      description: "single-line list, multi-line block",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 27
    },
    {
      code: "@media screen and (color) ,projection and (color) {\r\n}",
      description: "single-line list, multi-line block and CRLF",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 27
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-single-line"],

  accept: [
    {
      code: "@media screen and (color) ,projection and (color) {}"
    },
    {
      code: "@mEdIa screen and (color) ,projection and (color) {}"
    },
    {
      code: "@MEDIA screen and (color) ,projection and (color) {}"
    },
    {
      code: "@media screen and (color) ,projection and (color) {\n}",
      description: "single-line list, multi-line block"
    },
    {
      code: "@media screen and (color) ,projection and (color) {\r\n}",
      description: "single-line list, multi-line block and CRLF"
    },
    {
      code: "@media screen and (color),\nprojection and (color) {}",
      description: "ignore multi-line"
    },
    {
      code: "@media screen and (color),\r\nprojection and (color) {}",
      description: "ignore multi-line and CRLF"
    },
    {
      code: "@non-media screen and (color), projection and (color) {}",
      description: "ignore at-rules contain media in name"
    },
    {
      code: "@media-non screen and (color), projection and (color) {}",
      description: "ignore at-rules contain media in name"
    }
  ],

  reject: [
    {
      code: "@media screen and (color), projection and (color) {}",
      message: messages.rejectedAfterSingleLine(),
      line: 1,
      column: 26
    },
    {
      code: "@mEdIa screen and (color), projection and (color) {}",
      message: messages.rejectedAfterSingleLine(),
      line: 1,
      column: 26
    },
    {
      code: "@MEDIA screen and (color), projection and (color) {}",
      message: messages.rejectedAfterSingleLine(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color), projection and (color) {\n}",
      description: "single-line list, multi-line block",
      message: messages.rejectedAfterSingleLine(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color), projection and (color) {\r\n}",
      description: "single-line list, multi-line block and CRLF",
      message: messages.rejectedAfterSingleLine(),
      line: 1,
      column: 26
    }
  ]
});
