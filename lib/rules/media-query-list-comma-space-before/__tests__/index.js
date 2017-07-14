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
      code: "@media screen and (color) , projection and (color) {}"
    },
    {
      code: "@media screen and (color) ,  projection and (color) {}"
    },
    {
      code: "@media screen and (color) ,\nprojection and (color) {}"
    },
    {
      code: "@media screen and (color) ,\r\nprojection and (color) {}",
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
      message: messages.expectedBefore(),
      line: 1,
      column: 26
    },
    {
      code: "@mEdIa screen and (color), projection and (color) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 26
    },
    {
      code: "@MEDIA screen and (color), projection and (color) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color)  , projection and (color) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 28
    },
    {
      code: "@media screen and (color)\n, projection and (color) {}",
      message: messages.expectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "@media screen and (color)\r\n, projection and (color) {}",
      description: "CRLF",
      message: messages.expectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "@media screen and (color)\t, projection and (color) {}",
      message: messages.expectedBefore(),
      line: 1,
      column: 27
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "@import url(x.com?a=b ,c=d)"
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
      code: "@media screen and (color), projection and (color) {}"
    },
    {
      code: "@media screen and (color),\nprojection and (color) {}"
    },
    {
      code: "@media screen and (color),\r\nprojection and (color) {}",
      description: "CRLF"
    },
    {
      code: "@non-media screen and (color) , projection and (color) {}",
      description: "ignore at-rules contain media in name"
    },
    {
      code: "@media-non screen and (color) , projection and (color) {}",
      description: "ignore at-rules contain media in name"
    }
  ],

  reject: [
    {
      code: "@media screen and (color) , projection and (color) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 27
    },
    {
      code: "@mEdIa screen and (color) , projection and (color) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 27
    },
    {
      code: "@MEDIA screen and (color) , projection and (color) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 27
    },
    {
      code: "@media screen and (color)  , projection and (color) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 28
    },
    {
      code: "@media screen and (color)\n, projection and (color) {}",
      message: messages.rejectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "@media screen and (color)\r\n, projection and (color) {}",
      description: "CRLF",
      message: messages.rejectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "@media screen and (color)\t, projection and (color) {}",
      message: messages.rejectedBefore(),
      line: 1,
      column: 27
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-single-line"],

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
      description: "ignore multi-line"
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
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 26
    },
    {
      code: "@mEdIa screen and (color), projection and (color) {}",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 26
    },
    {
      code: "@MEDIA screen and (color), projection and (color) {}",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color), projection and (color) {\n}",
      description: "single-line list, multi-line block",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color), projection and (color) {\r\n}",
      description: "single-line list, multi-line block and CRLF",
      message: messages.expectedBeforeSingleLine(),
      line: 1,
      column: 26
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-single-line"],

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
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 27
    },
    {
      code: "@mEdIa screen and (color) ,projection and (color) {}",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 27
    },
    {
      code: "@MEDIA screen and (color) ,projection and (color) {}",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 27
    },
    {
      code: "@media screen and (color) ,projection and (color) {\n}",
      description: "single-line list, multi-line block",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 27
    },
    {
      code: "@media screen and (color) ,projection and (color) {\r\n}",
      description: "single-line list, multi-line block and CRLF",
      message: messages.rejectedBeforeSingleLine(),
      line: 1,
      column: 27
    }
  ]
});
