"use strict";

const rule = require("..");
const { messages, ruleName } = rule;

const MIN_VALUE = 100;

testRule(rule, {
  ruleName,
  config: [MIN_VALUE],

  accept: [
    {
      code: "a { transition-delay: 0.1s; }"
    },
    {
      code: "a { transition-delay: 0.2s; }"
    },
    {
      code: "a { -webkit-transition-delay: 0.2s; }"
    },
    {
      code: "a { tRaNsItIoN-dElAy: 0.2s; }"
    },
    {
      code: "a { TRANSITION-DELAY: 0.2s; }"
    },
    {
      code: "a { transition-delay: 3s; }"
    },
    {
      code: "a { transition-delay: 100ms; }"
    },
    {
      code: "a { transition-delay: 200ms; }"
    },
    {
      code: "a { transition-delay: 5000ms; }"
    },
    {
      code: "a { transition-duration: 0.15s; }"
    },
    {
      code: "a { -webkit-transition-duration: 0.15s; }"
    },
    {
      code: "a { transition-duration: 2.8s; }"
    },
    {
      code: "a { transition-duration: 330ms; }"
    },
    {
      code: "a { transition-duration: 4700ms; }"
    },
    {
      code: "a { transition: foo 0.8s linear; }"
    },
    {
      code: "a { -webkit-transition: foo 0.8s linear; }"
    },
    {
      code: "a { tRaNsItIoN: foo 0.8s linear; }"
    },
    {
      code: "a { TRANSITION: foo 0.8s linear; }"
    },
    {
      code: "a { transition: foo 0.8s 200ms ease-in-out; }"
    },
    {
      code: "a { animation-delay: 0.2s; }"
    },
    {
      code: "a { -webkit-animation-delay: 0.2s; }"
    },
    {
      code: "a { animation-delay: 3s; }"
    },
    {
      code: "a { animation-delay: 200ms; }"
    },
    {
      code: "a { animation-delay: 5000ms; }"
    },
    {
      code: "a { animation-duration: 0.15s; }"
    },
    {
      code: "a { -webkit-animation-duration: 0.15s; }"
    },
    {
      code: "a { animation-duration: 2.8s; }"
    },
    {
      code: "a { animation-duration: 330ms; }"
    },
    {
      code: "a { animation-duration: 4700ms; }"
    },
    {
      code: "a { animation: foo 0.8s linear; }"
    },
    {
      code: "a { -webkit-animation: foo 0.8s linear; }"
    },
    {
      code: "a { animation: foo 0.8s 200ms ease-in-out; }"
    },
    {
      description: "negative values should be ignored",
      code: "a { animation-delay: -2.5s; }"
    },
    {
      description: "negative values should be ignored",
      code: "a { animation-delay: -150ms; }"
    },
    {
      description: "negative values should be ignored",
      code: "a { animation-delay: -20ms; }"
    },
    {
      description: "this test should fail",
      code: "a { animation: foo 0.8s -20ms ease-in-out; }"
    },
    {
      description: "0ms is acceptable",
      code: "a { animation-delay: 0ms; }"
    },
    {
      description: "0 is acceptable",
      code: "a { animation-delay: 0; }"
    }
  ],

  reject: [
    {
      code: "a { transition-delay: 0.006s; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 23
    },
    {
      code: "a { -webkit-transition-delay: 0.006s; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 31
    },
    {
      code: "a { tRaNsItIoN-dElAy: 0.006s; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 23
    },
    {
      code: "a { TRANSITION-DELAY: 0.006s; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 23
    },
    {
      code: "a { transition-delay: 0.006S; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 23
    },
    {
      code: "a { transition-delay: 3ms; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 23
    },
    {
      code: "a { transition-delay: 3MS; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 23
    },
    {
      code: "a { transition-duration: 0.009s; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 26
    },
    {
      code: "a { -webkit-transition-duration: 0.009s; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 34
    },
    {
      code: "a { transition-duration: 80ms; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 26
    },
    {
      code: "a { transition: foo 0.008s linear; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 21
    },
    {
      code: "a { -webkit-transition: foo 0.008s linear; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 29
    },
    {
      code: "a { tRaNsItIoN: foo 0.008s linear; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 21
    },
    {
      code: "a { TRANSITION: foo 0.008s linear; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 21
    },
    {
      code: "a { transition: foo 0.8s 20ms ease-in-out; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 26
    },
    {
      code: "a { animation-delay: 0.006s; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 22
    },
    {
      code: "a { -webkit-animation-delay: 0.006s; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 30
    },
    {
      code: "a { animation-delay: 3ms; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 22
    },
    {
      code: "a { animation-duration: 0.009s; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 25
    },
    {
      code: "a { -webkit-animation-duration: 0.009s; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 33
    },
    {
      code: "a { animation-duration: 80ms; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 25
    },
    {
      code: "a { animation: foo 0.008s linear; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 20
    },
    {
      code: "a { -webkit-animation: foo 0.008s linear; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 28
    },
    {
      code: "a { animation: foo 0.8s 20ms ease-in-out; }",
      message: messages.expected(MIN_VALUE),
      line: 1,
      column: 25
    }
  ]
});
