"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

testRule(rule, {
  ruleName,
  config: [true],
  fix: true,
  accept: [
    {
      code: "a { margin-right: 10px; margin-top: 20px; }"
    },
    {
      code: "a { margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }"
    },
    {
      code:
        "a { padding-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }"
    },
    {
      code:
        "a { padding-top: 1px; padding-bottom: 1px; } b { padding-left: 1px; padding-right: 1px; }"
    },
    {
      code:
        "a { transition-delay: 0.5s; -webkit-transition-duration: 2s; -webkit-transition-property: top; -webkit-transition-timing-function: ease; }",
      description: "one of properties is unprefixed"
    },
    {
      code:
        "a { -webkit-transition-delay: 0.5s; transition-duration: 2s; transition-property: top; transition-timing-function: ease; }",
      description: "one of properties is prefixed"
    }
  ],

  reject: [
    {
      code:
        "a { margin-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }",
      message: messages.expected("margin")
    },
    {
      code:
        "a { MARGIN-LEFT: 10px; MARGIN-RIGHT: 10px; margin-top: 20px; margin-bottom: 30px; }",
      message: messages.expected("margin")
    },
    {
      code:
        "a { MARGIN-LEFT: 10px; MARGIN-RIGHT: 10px; MARGIN-TOP: 20px; MARGIN-BOTTOM: 30px; }",
      message: messages.expected("margin")
    },
    {
      code:
        "a { padding-left: 10px; padding-right: 10px; padding-top: 20px; padding-bottom: 30px; }",
      message: messages.expected("padding")
    },
    {
      code:
        "a { font-style: italic; font-variant: normal; font-weight: bold; font-size: .8em; font-family: Arial; line-height: 1.2; font-stretch: normal; }",
      message: messages.expected("font")
    },
    {
      code:
        "a { border-top-width: 7px; border-top-style: double; border-top-color: green; }",
      message: messages.expected("border-top")
    },
    {
      code:
        "a { -webkit-transition-delay: 0.5s; -webkit-transition-duration: 2s; -webkit-transition-property: top; -webkit-transition-timing-function: ease; }",
      message: messages.expected("-webkit-transition")
    },
    {
      code:
        "a { -WEBKIT-transition-delay: 0.5s; -webKIT-transition-duration: 2s; -webkit-TRANSITION-property: top; -webkit-transition-timing-function: ease; }",
      message: messages.expected("-webkit-transition")
    },
    {
      code:
        "a { border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-width: 1px; }",
      message: messages.expected("border-width")
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true, { ignoreShorthands: ["/border/", "padding"] }],
  fix: true,
  accept: [
    {
      code:
        "a { border-top-width: 7px; border-top-style: double; border-top-color: green; }"
    },
    {
      code:
        "a { padding-left: 10px; padding-right: 10px; padding-top: 20px; padding-bottom: 30px; }"
    }
  ],

  reject: [
    {
      code:
        "a { margin-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }",
      message: messages.expected("margin")
    }
  ]
});
