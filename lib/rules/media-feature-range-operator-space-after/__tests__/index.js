"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: ["always"],

  accept: [
    {
      code: "@media (width= 600px) {}"
    },
    {
      code: "@mEdIa (width= 600px) {}"
    },
    {
      code: "@MEDIA (width= 600px) {}"
    },
    {
      code: "@media (width > 600px) {}"
    },
    {
      code: "@media (width>= 600px) and (width<= 3em) {}"
    },
    {
      code: "@media /*(width>=600px) and*/ (width <= 3em) {}"
    },
    {
      code: "@media (width >= 600px) /*and (width<3em)*/ {}"
    },
    {
      code: "@media (width >= /*>*/ 600px) {}"
    }
  ],

  reject: [
    {
      code: "@media (width<600px) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 15
    },
    {
      code: "@mEdIa (width<600px) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 15
    },
    {
      code: "@MEDIA (width<600px) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 15
    },
    {
      code: "@media (width<=  600px) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 16
    },
    {
      code: "@media (width=\t600px) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 15
    },
    {
      code: "@media (width>\n600px) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 15
    },
    {
      code: "@media (width>\r\n600px) {}",
      description: "CRLF",
      message: messages.expectedAfter(),
      line: 1,
      column: 15
    },
    {
      code: "@media (width>=600px) and (width< 3em) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 16
    },
    {
      code: "@media (width> 600px) and (width=3em) {}",
      message: messages.expectedAfter(),
      line: 1,
      column: 34
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],

  accept: [
    {
      code: "@media (width =600px) {}"
    },
    {
      code: "@mEdIa (width =600px) {}"
    },
    {
      code: "@MEDIA (width =600px) {}"
    },
    {
      code: "@media (width>600px) {}"
    },
    {
      code: "@media (width >=600px) and (width <=3em) {}"
    },
    {
      code: "@media /*(width >= 600px) and*/ (width<=3em) {}"
    },
    {
      code: "@media (width>=600px) /*and (width < 3em)*/ {}"
    },
    {
      code: "@media (width>=/* > */ 600px) {}"
    }
  ],

  reject: [
    {
      code: "@media (width < 600px) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 16
    },
    {
      code: "@mEdIa (width < 600px) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 16
    },
    {
      code: "@MEDIA (width < 600px) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 16
    },
    {
      code: "@media (width <=  600px) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 17
    },
    {
      code: "@media (width =\t600px) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 16
    },
    {
      code: "@media (width >\n600px) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 16
    },
    {
      code: "@media (width >\r\n600px) {}",
      description: "CRLF",
      message: messages.rejectedAfter(),
      line: 1,
      column: 16
    },
    {
      code: "@media (width >= 600px) and (width <3em) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 17
    },
    {
      code: "@media (width >600px) and (width = 3em) {}",
      message: messages.rejectedAfter(),
      line: 1,
      column: 35
    }
  ]
});
