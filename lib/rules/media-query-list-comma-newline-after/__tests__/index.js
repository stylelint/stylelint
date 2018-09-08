"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],
  fix: true,

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
      code: "@media screen and (color),\nprojection and (color) {}"
    },
    {
      code: "@media screen and (color),\n\nprojection and (color) {}"
    },
    {
      code: "@media screen and (color) ,\n  projection and (color) {}"
    },
    {
      code: "@media screen and (color) ,\r\n  projection and (color) {}",
      description: "CRLF"
    },
    {
      code: "@media screen and (color) ,\r\n\r\n  projection and (color) {}",
      description: "CRLF"
    },
    {
      code: "@media screen and (color)\n,\n\t\t\tprojection and (color) {}",
      description: "indentation after the newline after the comma"
    },
    {
      code: "@media screen and (color)\r\n,\r\n\t\t\tprojection and (color) {}",
      description: "indentation after the CRLF after the comma"
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
      fixed: "@media screen and (color),\nprojection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@mEdIa screen and (color),projection and (color) {}",
      fixed: "@mEdIa screen and (color),\nprojection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@MEDIA screen and (color),projection and (color) {}",
      fixed: "@MEDIA screen and (color),\nprojection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color), projection and (color) {}",
      fixed: "@media screen and (color),\n projection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),  projection and (color) {}",
      fixed: "@media screen and (color),\n  projection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),\tprojection and (color) {}",
      fixed: "@media screen and (color),\n\tprojection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color), \n\tprojection and (color) {}",
      fixed: "@media screen and (color),\n\tprojection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),projection and (color) {\r\n}",
      fixed: "@media screen and (color),\r\nprojection and (color) {\r\n}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color), \r\n\tprojection and (color) {}",
      fixed: "@media screen and (color),\r\n\tprojection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),/**/projection and (color) {}",
      fixed: "@media screen and (color),\n/**/projection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      // we want to allow newline after comment.
      code: "@media screen and (color),/**/\nprojection and (color) {}",
      fixed: "@media screen and (color),\n/**/\nprojection and (color) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 26
    },
    {
      code: "@media " + "tv,".repeat(50) + "print {}",
      fixed: "@media " + "tv,\n".repeat(50) + "print {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 10
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-multi-line"],
  fix: true,

  accept: [
    {
      code: "@media screen and (color),\nprojection and (color) {}",
      description: "multi-line list, single-line block"
    },
    {
      code: "@mEdIa screen and (color),\nprojection and (color) {}",
      description: "multi-line list, single-line block"
    },
    {
      code: "@MEDIA screen and (color),\nprojection and (color) {}",
      description: "multi-line list, single-line block"
    },
    {
      code: "@media screen and (color),\r\nprojection and (color) {}",
      description: "multi-line list, single-line block and CRLF"
    },
    {
      code: "@media screen and (color),\nprojection and (color) {\n}",
      description: "multi-line list, multi-line block"
    },
    {
      code: "@media screen and (color),projection and (color) {}",
      description: "ignore single line list, single-lint block"
    },
    {
      code: "@media screen and (color),projection and (color) {\n}",
      description: "ignore single line list, multi-line block"
    },
    {
      code: "@media screen and (color),projection and (color) {\r\n}",
      description: "ignore single line list, multi-line block and CRLF"
    },
    {
      code: "@non-media screen and (color),projection and (color),\nprint {}",
      description: "ignore at-rules contain media in name"
    },
    {
      code: "@media-non screen and (color),projection and (color),\nprint {}",
      description: "ignore at-rules contain media in name"
    }
  ],

  reject: [
    {
      code: "@media screen and (color),projection and (color),\nprint {}",
      fixed: "@media screen and (color),\nprojection and (color),\nprint {}",
      message: messages.expectedAfterMultiLine(),
      line: 1,
      column: 26
    },
    {
      code: "@mEdIa screen and (color),projection and (color),\nprint {}",
      fixed: "@mEdIa screen and (color),\nprojection and (color),\nprint {}",
      message: messages.expectedAfterMultiLine(),
      line: 1,
      column: 26
    },
    {
      code: "@MEDIA screen and (color),projection and (color),\nprint {}",
      fixed: "@MEDIA screen and (color),\nprojection and (color),\nprint {}",
      message: messages.expectedAfterMultiLine(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),projection and (color),\nprint {\n}",
      fixed: "@media screen and (color),\nprojection and (color),\nprint {\n}",
      message: messages.expectedAfterMultiLine(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),projection and (color),\r\nprint {\r\n}",
      fixed:
        "@media screen and (color),\r\nprojection and (color),\r\nprint {\r\n}",
      description: "CRLF",
      message: messages.expectedAfterMultiLine(),
      line: 1,
      column: 26
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never-multi-line"],
  fix: true,

  accept: [
    {
      code: "@media screen and (color)\n,projection and (color) {}",
      description: "multi-line list, single-line block"
    },
    {
      code: "@mEdIa screen and (color)\n,projection and (color) {}",
      description: "multi-line list, single-line block"
    },
    {
      code: "@MEDIA screen and (color)\n,projection and (color) {}",
      description: "multi-line list, single-line block"
    },
    {
      code: "@media screen and (color)\r\n,projection and (color) {}",
      description: "multi-line list, single-line block and CRLF"
    },
    {
      code: "@media screen and (color)\n,projection and (color) {\n}",
      description: "multi-line list, multi-line block"
    },
    {
      code: "@media screen and (color)\r\n,projection and (color) {\r\n}",
      description: "multi-line list, multi-line block and CRLF"
    },
    {
      code: "@media screen and (color), projection and (color) {}",
      description: "ignore single line list, single-lint block"
    },
    {
      code: "@media screen and (color), projection and (color) {\n}",
      description: "ignore single line list, multi-line block"
    },
    {
      code: "@non-media screen and (color) ,projection and (color),\nprint {}",
      description: "ignore at-rules contain media in name"
    },
    {
      code: "@media-non screen and (color) ,projection and (color),\nprint {}",
      description: "ignore at-rules contain media in name"
    }
  ],

  reject: [
    {
      code: "@media screen and (color) ,projection and (color),\nprint {}",
      fixed: "@media screen and (color) ,projection and (color),print {}",
      message: messages.rejectedAfterMultiLine(),
      line: 1,
      column: 50
    },
    {
      code: "@mEdIa screen and (color) ,projection and (color),\nprint {}",
      fixed: "@mEdIa screen and (color) ,projection and (color),print {}",
      message: messages.rejectedAfterMultiLine(),
      line: 1,
      column: 50
    },
    {
      code: "@MEDIA screen and (color) ,projection and (color),\nprint {}",
      fixed: "@MEDIA screen and (color) ,projection and (color),print {}",
      message: messages.rejectedAfterMultiLine(),
      line: 1,
      column: 50
    },
    {
      code: "@media screen and (color) ,projection and (color),\nprint {\n}",
      fixed: "@media screen and (color) ,projection and (color),print {\n}",
      message: messages.rejectedAfterMultiLine(),
      line: 1,
      column: 50
    },
    {
      code:
        "@media screen and (color) ,projection and (color),\r\nprint {\r\n}",
      fixed: "@media screen and (color) ,projection and (color),print {\r\n}",
      description: "CRLF",
      message: messages.rejectedAfterMultiLine(),
      line: 1,
      column: 50
    },
    {
      code: "@media screen and (color),\t\n projection and (color) {}",
      fixed: "@media screen and (color),projection and (color) {}",
      message: messages.rejectedAfterMultiLine(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),\t\r\n projection and (color) {}",
      fixed: "@media screen and (color),projection and (color) {}",
      message: messages.rejectedAfterMultiLine(),
      line: 1,
      column: 26
    },
    {
      code: "@media screen and (color),\n/**/\nprojection and (color) {}",
      fixed: "@media screen and (color),/**/\nprojection and (color) {}",
      message: messages.rejectedAfterMultiLine(),
      line: 1,
      column: 26
    },
    {
      code: "@media " + "tv,\n".repeat(50) + "print {\n}",
      fixed: "@media " + "tv,".repeat(50) + "print {\n}",
      message: messages.rejectedAfterMultiLine(),
      line: 1,
      column: 10
    }
  ]
});
